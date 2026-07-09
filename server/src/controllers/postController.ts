/**
 * Post Controller
 * 
 * Handles social feed posts, feed updates, and likes toggling.
 */

import { Request, Response } from "express";
import { Post } from "../models/Post";
import { Like } from "../models/Like";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── CREATE FEED POST ────────────────────────────────────────────────────────
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const authorId = req.user._id;
  const { content } = req.body;

  if (!content) throw ApiError.badRequest("Post content is required");

  const post = await Post.create({
    author: authorId,
    content,
  });

  const populatedPost = await Post.findById(post._id).populate(
    "author",
    "firstName lastName avatar role headline"
  );

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: populatedPost,
  });
});

// ─── GET FEED POSTS ──────────────────────────────────────────────────────────
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const posts = await Post.find()
    .populate("author", "firstName lastName avatar role headline")
    .sort({ createdAt: -1 })
    .limit(50);

  // Map to add "isLiked" boolean flag if user is logged in
  let responseData = posts.map(p => p.toJSON());
  if (userId) {
    const postIds = posts.map(p => p._id);
    const userLikes = await Like.find({ user: userId, post: { $in: postIds } });
    const likedPostIdsSet = new Set(userLikes.map(l => String(l.post)));

    responseData = responseData.map(p => ({
      ...p,
      isLiked: likedPostIdsSet.has(String(p._id)),
    }));
  }

  res.status(200).json({
    success: true,
    data: responseData,
  });
});

// ─── LIKE / UNLIKE POST ──────────────────────────────────────────────────────
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const userId = req.user._id;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound("Post not found");

  const existingLike = await Like.findOne({ post: postId, user: userId });

  if (existingLike) {
    // Unlike
    await Like.findByIdAndDelete(existingLike._id);
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      data: { isLiked: false },
    });
  } else {
    // Like
    await Like.create({ post: postId, user: userId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      data: { isLiked: true },
    });
  }
});
