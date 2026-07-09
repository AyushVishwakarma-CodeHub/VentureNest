/**
 * MentorSession Model
 * 
 * MongoDB schema for tracking detailed 1-on-1 mentorship session requests, approvals,
 * and completion status.
 */

import mongoose, { Schema } from "mongoose";

const mentorSessionSchema = new Schema(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Session must have a mentor"],
    },
    entrepreneur: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Session must have an entrepreneur"],
    },
    startup: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
    },
    topic: {
      type: String,
      required: [true, "Session topic/theme is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "rejected", "completed"],
      default: "requested",
    },
    scheduledAt: {
      type: Date,
    },
    duration: {
      type: Number, // in minutes
      default: 45,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
mentorSessionSchema.index({ mentor: 1, status: 1 });
mentorSessionSchema.index({ entrepreneur: 1, status: 1 });

export const MentorSession = mongoose.model("MentorSession", mentorSessionSchema);
export default MentorSession;
