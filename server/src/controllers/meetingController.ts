/**
 * Meeting Controller
 * 
 * Handles booking, listing, and completing calendar sync requests on the platform.
 */

import { Request, Response } from "express";
import { Meeting } from "../models/Meeting";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── BOOK MEETING ────────────────────────────────────────────────────────────
export const scheduleMeeting = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const hostId = req.user._id;
  const { attendeeId, title, description, date, duration } = req.body;

  // Generate a mock video conference link (Jitsi or Zoom) for video calls
  const videoLink = `https://meet.jit.si/StartupPitchHub-${Math.random().toString(36).substring(2, 10)}`;

  const meeting = await Meeting.create({
    host: hostId,
    attendee: attendeeId,
    title,
    description,
    date,
    duration,
    videoLink,
  });

  // Notify attendee
  await Notification.create({
    user: attendeeId,
    type: "meeting",
    title: "New Meeting Scheduled",
    message: `${req.user.firstName} ${req.user.lastName} scheduled a meeting: "${title}"`,
    actionUrl: `/dashboard/meetings`,
  });

  res.status(251).json({
    success: true,
    message: "Meeting scheduled successfully",
    data: meeting,
  });
});

// ─── GET MEETINGS ────────────────────────────────────────────────────────────
export const getMeetings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  const meetings = await Meeting.find({
    $or: [{ host: userId }, { attendee: userId }],
  })
    .populate("host", "firstName lastName email avatar role")
    .populate("attendee", "firstName lastName email avatar role")
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    data: meetings,
  });
});

// ─── UPDATE MEETING STATUS ───────────────────────────────────────────────────
export const updateMeetingStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const { status } = req.body; // completed, cancelled

  if (!["completed", "cancelled"].includes(status)) {
    throw ApiError.badRequest("Invalid meeting status");
  }

  const meeting = await Meeting.findById(id);
  if (!meeting) throw ApiError.notFound("Meeting not found");

  if (String(meeting.host) !== String(userId) && String(meeting.attendee) !== String(userId)) {
    throw ApiError.forbidden("You are not part of this meeting");
  }

  meeting.status = status;
  await meeting.save();

  // Notify other user
  const otherParty = String(meeting.host) === String(userId) ? meeting.attendee : meeting.host;
  await Notification.create({
    user: otherParty,
    type: "meeting",
    title: `Meeting ${status.toUpperCase()}`,
    message: `The meeting "${meeting.title}" has been ${status}`,
    actionUrl: `/dashboard/meetings`,
  });

  res.status(200).json({
    success: true,
    message: `Meeting status updated to ${status}`,
    data: meeting,
  });
});
