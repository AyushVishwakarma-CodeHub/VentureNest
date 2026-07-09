/**
 * Review Model
 * 
 * MongoDB schema for tracking ratings and review comments left by entrepreneurs/users
 * for mentors on the platform.
 */

import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must have a reviewer"],
    },
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: "User", // The mentor being rated
      required: [true, "Review must target a mentor (reviewee)"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent double reviewing the same mentor
reviewSchema.index({ reviewer: 1, reviewee: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1 });

export const Review = mongoose.model("Review", reviewSchema);
export default Review;
