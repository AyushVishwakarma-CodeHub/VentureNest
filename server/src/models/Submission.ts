/**
 * Submission Model
 * 
 * MongoDB schema for tracking startup entries/submissions into pitch competitions.
 */

import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Submission must belong to a competition"],
    },
    startup: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: [true, "Submission must be submitted by a registered startup"],
    },
    pitchDeckUrl: {
      type: String,
      trim: true,
    },
    videoDemoUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Submission summary cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate submissions from the same startup to a competition
submissionSchema.index({ competition: 1, startup: 1 }, { unique: true });

export const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
