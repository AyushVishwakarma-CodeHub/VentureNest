/**
 * Competition Model
 * 
 * MongoDB schema for tracking pitch competitions, hackathons, prize pools, and rules.
 */

import mongoose, { Schema } from "mongoose";

const competitionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Competition title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Competition description is required"],
      trim: true,
    },
    rules: {
      type: String,
      required: [true, "Competition rules are required"],
      trim: true,
    },
    prizePool: {
      type: Number,
      required: [true, "Prize pool value is required"],
      min: [0, "Prize pool cannot be negative"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Competition must have an organizer"],
    },
    participantsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
competitionSchema.index({ status: 1 });
competitionSchema.index({ startDate: 1 });

export const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
