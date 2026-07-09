/**
 * Vote Model
 * 
 * MongoDB schema for tracking ratings and review feedback left by judges or users
 * for pitch competition submissions.
 */

import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema(
  {
    submission: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: [true, "Vote must target a competition submission"],
    },
    judge: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vote must belong to a judge (user)"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [1, "Minimum score is 1"],
      max: [10, "Maximum score is 10"],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent double scoring the same submission by the same judge
voteSchema.index({ submission: 1, judge: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
