/**
 * Meeting Model
 * 
 * MongoDB schema for tracking scheduled meetings between founders, investors, and mentors.
 */

import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Meeting must have a host"],
    },
    attendee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Meeting must have an attendee"],
    },
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Meeting date and time is required"],
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Meeting duration is required"],
      default: 30,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    videoLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
meetingSchema.index({ host: 1, date: 1 });
meetingSchema.index({ attendee: 1, date: 1 });
meetingSchema.index({ status: 1 });

export const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
