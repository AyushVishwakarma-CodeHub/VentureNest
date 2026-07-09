/**
 * Mentor Controller
 * 
 * Manages listing mentors, booking mentorship requests, and session status updates.
 */

import { Request, Response } from "express";
import { MentorSession } from "../models/MentorSession";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── LIST MENTORS ────────────────────────────────────────────────────────────
export const listMentors = asyncHandler(async (_req: Request, res: Response) => {
  const mentors = await User.find({ role: "mentor", isActive: true })
    .select("firstName lastName email avatar headline bio interests")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: mentors,
  });
});

// ─── BOOK SESSION REQUEST ────────────────────────────────────────────────────
export const requestSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const entrepreneurId = req.user._id;
  const { mentorId, startupId, topic, duration, scheduledAt } = req.body;

  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.role !== "mentor") {
    throw ApiError.badRequest("Selected user is not a registered mentor");
  }

  const session = await MentorSession.create({
    mentor: mentorId,
    entrepreneur: entrepreneurId,
    startup: startupId,
    topic,
    duration,
    scheduledAt,
  });

  // Notify mentor
  await Notification.create({
    user: mentorId,
    type: "meeting",
    title: "New Mentorship Request",
    message: `${req.user.firstName} ${req.user.lastName} requested a session on "${topic}"`,
    actionUrl: `/dashboard/mentor/sessions`,
  });

  res.status(251).json({
    success: true,
    message: "Mentorship session requested successfully",
    data: session,
  });
});

// ─── GET SESSIONS ────────────────────────────────────────────────────────────
export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const role = req.user?.role;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  let query = {};
  if (role === "mentor") {
    query = { mentor: userId };
  } else if (role === "entrepreneur") {
    query = { entrepreneur: userId };
  } else {
    throw ApiError.forbidden("Access denied");
  }

  const sessions = await MentorSession.find(query)
    .populate("mentor", "firstName lastName email avatar headline")
    .populate("entrepreneur", "firstName lastName email avatar")
    .populate("startup", "name slug")
    .sort({ scheduledAt: 1 });

  res.status(200).json({
    success: true,
    data: sessions,
  });
});

// ─── UPDATE SESSION STATUS ───────────────────────────────────────────────────
export const updateSessionStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const { status, notes } = req.body; // accepted, rejected, completed

  if (!["accepted", "rejected", "completed"].includes(status)) {
    throw ApiError.badRequest("Invalid session status");
  }

  const session = await MentorSession.findById(id);
  if (!session) throw ApiError.notFound("Session not found");

  // Only the mentor can update session status
  if (String(session.mentor) !== String(userId)) {
    throw ApiError.forbidden("Only the mentor can update this session");
  }

  session.status = status;
  if (notes) session.notes = notes;
  await session.save();

  // Notify entrepreneur
  await Notification.create({
    user: session.entrepreneur,
    type: "meeting",
    title: `Mentorship Session ${status.toUpperCase()}`,
    message: `Your session on "${session.topic}" has been ${status}`,
    actionUrl: `/dashboard/mentor/sessions`,
  });

  res.status(200).json({
    success: true,
    message: `Session ${status} successfully`,
    data: session,
  });
});
