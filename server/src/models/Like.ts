/**
 * Like Model
 * 
 * MongoDB schema for tracking likes left by users under social feed posts.
 */

import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Like must belong to a post"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like must belong to a user"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double liking the same post
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
export default Like;
