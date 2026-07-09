/**
 * Chat Controller
 * 
 * Handles direct messaging room creation and listings.
 */

import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── CREATE DIRECT CHAT ROOM ─────────────────────────────────────────────────
export const createChat = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const myId = req.user._id;
  const { recipientId } = req.body;

  if (!recipientId) throw ApiError.badRequest("Recipient ID is required");

  // Check if chat already exists between these two participants
  let chat = await Chat.findOne({
    participants: { $all: [myId, recipientId], $size: 2 },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [myId, recipientId],
    });
  }

  // Populate participants for response
  const populatedChat = await Chat.findById(chat._id).populate(
    "participants",
    "firstName lastName email avatar role"
  );

  res.status(201).json({
    success: true,
    data: populatedChat,
  });
});

// ─── GET USER CHAT LISTS ─────────────────────────────────────────────────────
export const getChats = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const myId = req.user._id;

  const chats = await Chat.find({ participants: myId })
    .populate("participants", "firstName lastName email avatar role headline")
    .populate({
      path: "latestMessage",
      populate: { path: "sender", select: "firstName lastName" }
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: chats,
  });
});
