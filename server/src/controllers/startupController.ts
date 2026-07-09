/**
 * Startup Controller
 * 
 * Handles all startup-related operations: CRUD, advanced search/filtering,
 * image/document/video uploads, traction metrics, milestones, and bookmark/follow actions.
 */

import { Request, Response } from "express";
import { Startup } from "../models/Startup";
import { Bookmark } from "../models/Bookmark";
import { Follow } from "../models/Follow";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import * as cloudinaryService from "../services/cloudinaryService";
import { UserRole } from "../types";

// ─── CREATE STARTUP ──────────────────────────────────────────────────────────
export const createStartup = asyncHandler(async (req: Request, res: Response) => {
  const founderId = req.user?._id;
  if (!founderId) {
    throw ApiError.unauthorized("Authentication required");
  }

  // Check if user already has a startup profile (founders can only have one startup in the system)
  const existingStartup = await Startup.findOne({ founder: founderId });
  if (existingStartup && req.user?.role !== UserRole.ADMIN) {
    throw ApiError.badRequest("You have already registered a startup. Update your existing profile instead.");
  }

  const startupData = {
    ...req.body,
    founder: founderId,
  };

  const startup = await Startup.create(startupData);

  res.status(201).json({
    success: true,
    message: "Startup profile created successfully",
    data: startup,
  });
});

// ─── GET ALL STARTUPS (WITH FILTERS & SEARCH) ──────────────────────────────────
export const getStartups = asyncHandler(async (req: Request, res: Response) => {
  const {
    search,
    stage,
    industry,
    location,
    minFunding,
    maxFunding,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  const query: Record<string, any> = {};

  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { headline: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filters
  if (stage) {
    query.stage = stage;
  }
  if (industry) {
    const industries = Array.isArray(industry) ? industry : [industry];
    query.industry = { $in: industries };
  }
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Funding raised range filter
  if (minFunding || maxFunding) {
    query.fundingRaised = {};
    if (minFunding) query.fundingRaised.$gte = Number(minFunding);
    if (maxFunding) query.fundingRaised.$lte = Number(maxFunding);
  }

  // Pagination setups
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortOption: Record<string, any> = { createdAt: -1 }; // default: newest first
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "fundingHigh") sortOption = { fundingRaised: -1 };
  if (sort === "views") sortOption = { views: -1 };
  if (sort === "followers") sortOption = { followersCount: -1 };

  const startups = await Startup.find(query)
    .populate("founder", "firstName lastName email avatar")
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const total = await Startup.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Startups fetched successfully",
    data: startups,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// ─── GET STARTUP BY SLUG ──────────────────────────────────────────────────────
export const getStartupBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  // Find and increment views count
  const startup = await Startup.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("founder", "firstName lastName email avatar")
   .populate("cofounders", "firstName lastName email avatar");

  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  // Check if current user bookmarked or followed
  let isBookmarked = false;
  let isFollowing = false;

  if (req.user) {
    const bookmark = await Bookmark.findOne({ user: req.user._id, startup: startup._id });
    isBookmarked = !!bookmark;

    const follow = await Follow.findOne({ follower: req.user._id, followingType: "startup", followingStartup: startup._id });
    isFollowing = !!follow;
  }

  res.status(200).json({
    success: true,
    message: "Startup details retrieved",
    data: {
      ...startup.toJSON(),
      isBookmarked,
      isFollowing,
    },
  });
});

// ─── UPDATE STARTUP ──────────────────────────────────────────────────────────
export const updateStartup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const startup = await Startup.findById(id);

  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  // Check permissions: founder or admin
  const isFounder = startup.founder.toString() === req.user?._id.toString();
  const isAdmin = req.user?.role === UserRole.ADMIN;
  if (!isFounder && !isAdmin) {
    throw ApiError.forbidden("You do not have permission to edit this startup");
  }

  const updatedStartup = await Startup.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Startup profile updated successfully",
    data: updatedStartup,
  });
});

// ─── DELETE STARTUP ──────────────────────────────────────────────────────────
export const deleteStartup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const startup = await Startup.findById(id);

  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  // Check permissions: founder or admin
  const isFounder = startup.founder.toString() === req.user?._id.toString();
  const isAdmin = req.user?.role === UserRole.ADMIN;
  if (!isFounder && !isAdmin) {
    throw ApiError.forbidden("You do not have permission to delete this startup");
  }

  // Delete files from Cloudinary if URLs exist
  if (startup.logo) {
    const logoPublicId = startup.logo.split("/").pop()?.split(".")[0];
    if (logoPublicId) await cloudinaryService.deleteFile(`startup-pitch-hub/logos/${logoPublicId}`, "image").catch(() => {});
  }
  if (startup.pitchDeck) {
    const pitchPublicId = startup.pitchDeck.split("/").pop()?.split(".")[0];
    if (pitchPublicId) await cloudinaryService.deleteFile(`startup-pitch-hub/decks/${pitchPublicId}`, "raw").catch(() => {});
  }
  if (startup.videoDemo) {
    const videoPublicId = startup.videoDemo.split("/").pop()?.split(".")[0];
    if (videoPublicId) await cloudinaryService.deleteFile(`startup-pitch-hub/videos/${videoPublicId}`, "video").catch(() => {});
  }

  // Delete all bookmarks and follows associated
  await Bookmark.deleteMany({ startup: id });
  await Follow.deleteMany({ followingType: "startup", followingStartup: id });
  await Startup.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Startup profile deleted successfully",
  });
});

// ─── MEDIA UPLOADS ────────────────────────────────────────────────────────────
export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.file) {
    throw ApiError.badRequest("Please provide an image file");
  }

  const startup = await Startup.findById(id);
  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  if (startup.founder.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    throw ApiError.forbidden("Permission denied");
  }

  const result = await cloudinaryService.uploadImage(req.file, "logos");
  startup.logo = result.secure_url;
  await startup.save();

  res.status(200).json({
    success: true,
    message: "Logo uploaded successfully",
    data: { logoUrl: startup.logo },
  });
});

export const uploadPitchDeck = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.file) {
    throw ApiError.badRequest("Please provide a pitch deck document (PDF, etc.)");
  }

  const startup = await Startup.findById(id);
  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  if (startup.founder.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    throw ApiError.forbidden("Permission denied");
  }

  const result = await cloudinaryService.uploadDocument(req.file, "decks");
  startup.pitchDeck = result.secure_url;
  await startup.save();

  res.status(200).json({
    success: true,
    message: "Pitch deck document uploaded successfully",
    data: { pitchDeckUrl: startup.pitchDeck },
  });
});

export const uploadVideoDemo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.file) {
    throw ApiError.badRequest("Please provide a video file");
  }

  const startup = await Startup.findById(id);
  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  if (startup.founder.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    throw ApiError.forbidden("Permission denied");
  }

  const result = await cloudinaryService.uploadVideo(req.file, "videos");
  startup.videoDemo = result.secure_url;
  await startup.save();

  res.status(200).json({
    success: true,
    message: "Video demo uploaded successfully",
    data: { videoDemoUrl: startup.videoDemo },
  });
});

// ─── TRACTION METRICS ─────────────────────────────────────────────────────────
export const addTractionMetric = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { metricName, metricValue, date } = req.body;

  const startup = await Startup.findById(id);
  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  if (startup.founder.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    throw ApiError.forbidden("Permission denied");
  }

  startup.traction.push({ metricName, metricValue, date: new Date(date) });
  await startup.save();

  res.status(200).json({
    success: true,
    message: "Traction metric added successfully",
    data: startup.traction,
  });
});

// ─── MILESTONES ──────────────────────────────────────────────────────────────
export const addMilestone = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date, completed } = req.body;

  const startup = await Startup.findById(id);
  if (!startup) {
    throw ApiError.notFound("Startup not found");
  }

  if (startup.founder.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ADMIN) {
    throw ApiError.forbidden("Permission denied");
  }

  startup.milestones.push({ title, description, date: new Date(date), completed });
  await startup.save();

  res.status(200).json({
    success: true,
    message: "Milestone added successfully",
    data: startup.milestones,
  });
});

// ─── GET MY STARTUP ──────────────────────────────────────────────────────────
export const getMyStartup = asyncHandler(async (req: Request, res: Response) => {
  const founderId = req.user?._id;
  if (!founderId) {
    throw ApiError.unauthorized("Authentication required");
  }

  const startup = await Startup.findOne({ founder: founderId })
    .populate("founder", "firstName lastName email avatar")
    .populate("cofounders", "firstName lastName email avatar");

  if (!startup) {
    throw ApiError.notFound("You have not created a startup profile yet.");
  }

  res.status(200).json({
    success: true,
    message: "My startup profile retrieved successfully",
    data: startup,
  });
});
