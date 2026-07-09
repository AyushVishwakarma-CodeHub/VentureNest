/**
 * Investment Model
 * 
 * MongoDB schema for tracking investment proposals, status tracking, and negotiations
 * between investors and startups.
 */

import mongoose, { Schema } from "mongoose";

const investmentSchema = new Schema(
  {
    investor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Investment proposal must have an investor"],
    },
    startup: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: [true, "Investment proposal must target a startup"],
    },
    amount: {
      type: Number,
      required: [true, "Investment amount is required"],
      min: [1, "Investment amount must be greater than 0"],
    },
    equityOffered: {
      type: Number,
      required: [true, "Equity percentage offered is required"],
      min: [0.01, "Equity must be greater than 0%"],
      max: [100, "Equity cannot exceed 100%"],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    timeline: [
      {
        status: { type: String, required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
investmentSchema.index({ investor: 1, startup: 1 });
investmentSchema.index({ status: 1 });
investmentSchema.index({ createdAt: -1 });

export const Investment = mongoose.model("Investment", investmentSchema);
export default Investment;
