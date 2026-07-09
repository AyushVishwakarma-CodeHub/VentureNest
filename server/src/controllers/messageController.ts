/**
 * Message Controller
 * 
 * Handles sending chat messages, updating room references, and triggering socket broadcasts.
 */

import { Request, Response } from "express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── SEND CHAT MESSAGE ───────────────────────────────────────────────────────
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const myId = req.user._id;
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    throw ApiError.badRequest("Chat ID and message text are required");
  }

  // Add message record
  const message = await Message.create({
    chat: chatId,
    sender: myId,
    text,
  });

  // Update latest message in Chat room
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message._id,
  });

  const populatedMsg = await Message.findById(message._id)
    .populate("sender", "firstName lastName avatar email role");

  // Broadcast real-time update to Socket.io room members
  const io = req.app.get("io");
  if (io) {
    io.to(chatId).emit("message_received", populatedMsg);
  }

  res.status(201).json({
    success: true,
    data: populatedMsg,
  });
});

// ─── GET CHAT MESSAGE HISTORY ────────────────────────────────────────────────
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "firstName lastName avatar role")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: messages,
  });
});
