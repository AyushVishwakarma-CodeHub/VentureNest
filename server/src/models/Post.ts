/**
 * Post Model
 * 
 * MongoDB schema for tracking social feed posts shared by founders/investors.
 */

import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must have an author"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [1000, "Post content cannot exceed 1000 characters"],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
export default Post;
