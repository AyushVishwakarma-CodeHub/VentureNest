/**
 * Comment Model
 * 
 * MongoDB schema for tracking comments left under social feed posts.
 */

import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must have an author"],
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ post: 1, createdAt: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
