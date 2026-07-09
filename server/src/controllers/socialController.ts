/**
 * Social Controller
 * 
 * Handles bookmarking and following actions for users and startups.
 */

import { Request, Response } from "express";
import { Bookmark } from "../models/Bookmark";
import { Follow } from "../models/Follow";
import { Startup } from "../models/Startup";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── BOOKMARK STARTUP ────────────────────────────────────────────────────────
export const bookmarkStartup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { startupId } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const startup = await Startup.findById(startupId);
  if (!startup) throw ApiError.notFound("Startup not found");

  // Check if already bookmarked
  const existingBookmark = await Bookmark.findOne({ user: userId, startup: startupId });
  if (existingBookmark) {
    throw ApiError.badRequest("You have already bookmarked this startup");
  }

  // Create bookmark and increment startup bookmarks count
  await Bookmark.create({ user: userId, startup: startupId });
  await Startup.findByIdAndUpdate(startupId, { $inc: { bookmarksCount: 1 } });

  res.status(200).json({
    success: true,
    message: "Startup bookmarked successfully",
  });
});

// ─── UNBOOKMARK STARTUP ──────────────────────────────────────────────────────
export const unbookmarkStartup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { startupId } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const bookmark = await Bookmark.findOneAndDelete({ user: userId, startup: startupId });
  if (!bookmark) {
    throw ApiError.badRequest("You have not bookmarked this startup");
  }

  // Decrement startup bookmarks count
  await Startup.findByIdAndUpdate(startupId, { $inc: { bookmarksCount: -1 } });

  res.status(200).json({
    success: true,
    message: "Startup unbookmarked successfully",
  });
});

// ─── GET BOOKMARKED STARTUPS ─────────────────────────────────────────────────
export const getBookmarkedStartups = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  const bookmarks = await Bookmark.find({ user: userId }).populate({
    path: "startup",
    populate: { path: "founder", select: "firstName lastName email avatar" },
  });

  const startups = bookmarks.map(b => b.startup).filter(s => s !== null);

  res.status(200).json({
    success: true,
    data: startups,
  });
});

// ─── FOLLOW STARTUP ──────────────────────────────────────────────────────────
export const followStartup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { startupId } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const startup = await Startup.findById(startupId);
  if (!startup) throw ApiError.notFound("Startup not found");

  const existingFollow = await Follow.findOne({
    follower: userId,
    followingType: "startup",
    followingStartup: startupId,
  });

  if (existingFollow) {
    throw ApiError.badRequest("You are already following this startup");
  }

  await Follow.create({
    follower: userId,
    followingType: "startup",
    followingStartup: startupId,
  });

  await Startup.findByIdAndUpdate(startupId, { $inc: { followersCount: 1 } });

  res.status(200).json({
    success: true,
    message: "Following startup now",
  });
});

// ─── UNFOLLOW STARTUP ────────────────────────────────────────────────────────
export const unfollowStartup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { startupId } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const follow = await Follow.findOneAndDelete({
    follower: userId,
    followingType: "startup",
    followingStartup: startupId,
  });

  if (!follow) {
    throw ApiError.badRequest("You are not following this startup");
  }

  await Startup.findByIdAndUpdate(startupId, { $inc: { followersCount: -1 } });

  res.status(200).json({
    success: true,
    message: "Unfollowed startup successfully",
  });
});

// ─── FOLLOW USER ─────────────────────────────────────────────────────────────
export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { targetUserId } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");
  if (userId.toString() === targetUserId) {
    throw ApiError.badRequest("You cannot follow yourself");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw ApiError.notFound("User not found");

  const existingFollow = await Follow.findOne({
    follower: userId,
    followingType: "user",
    followingUser: targetUserId,
  });

  if (existingFollow) {
    throw ApiError.badRequest("You are already following this user");
  }

  await Follow.create({
    follower: userId,
    followingType: "user",
    followingUser: targetUserId,
  });

  res.status(200).json({
    success: true,
    message: "Following user now",
  });
});

// ─── UNFOLLOW USER ───────────────────────────────────────────────────────────
export const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { targetUserId } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const follow = await Follow.findOneAndDelete({
    follower: userId,
    followingType: "user",
    followingUser: targetUserId,
  });

  if (!follow) {
    throw ApiError.badRequest("You are not following this user");
  }

  res.status(200).json({
    success: true,
    message: "Unfollowed user successfully",
  });
});
