/**
 * Comment Controller
 * 
 * Handles adding and listing comments under social feed updates.
 */

import { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── ADD COMMENT ─────────────────────────────────────────────────────────────
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const authorId = req.user._id;
  const { postId, content } = req.body;

  if (!postId || !content) {
    throw ApiError.badRequest("Post ID and comment content are required");
  }

  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound("Post not found");

  const comment = await Comment.create({
    post: postId,
    author: authorId,
    content,
  });

  // Increment commentsCount in Post
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  const populatedComment = await Comment.findById(comment._id).populate(
    "author",
    "firstName lastName avatar role headline"
  );

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: populatedComment,
  });
});

// ─── GET COMMENTS FOR A POST ────────────────────────────────────────────────
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("author", "firstName lastName avatar role headline")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: comments,
  });
});
