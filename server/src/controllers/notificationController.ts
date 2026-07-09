/**
 * Notification Controller
 * 
 * Handles listing, reading, and clearing user notifications.
 */

import { Request, Response } from "express";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── GET USER NOTIFICATIONS ──────────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ user: userId, read: false });

  res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount,
    },
  });
});

// ─── MARK NOTIFICATION AS READ ───────────────────────────────────────────────
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { read: true },
    { new: true }
  );

  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

// ─── MARK ALL AS READ ────────────────────────────────────────────────────────
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  await Notification.updateMany({ user: userId, read: false }, { read: true });

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// ─── DELETE NOTIFICATION ─────────────────────────────────────────────────────
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) throw ApiError.unauthorized("Authentication required");

  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});
