/**
 * Startup Model
 * 
 * MongoDB schema for startup profiles. Contains detailed business, financial, 
 * team, and pitch information.
 */

import mongoose, { Schema } from "mongoose";
import { IStartup, StartupStage } from "../types";

const tractionSchema = new Schema(
  {
    metricName: { type: String, required: true, trim: true },
    metricValue: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const milestoneSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const startupSchema = new Schema<IStartup>(
  {
    name: {
      type: String,
      required: [true, "Startup name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Startup name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: undefined,
    },
    headline: {
      type: String,
      required: [true, "One-line headline is required"],
      trim: true,
      maxlength: [150, "Headline cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Detailed description is required"],
      trim: true,
    },
    founder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Startup must have a founder"],
    },
    cofounders: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    industry: {
      type: [String],
      required: [true, "At least one industry is required"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "At least one industry must be selected",
      },
    },
    stage: {
      type: String,
      enum: {
        values: Object.values(StartupStage),
        message: "Invalid startup stage",
      },
      required: [true, "Startup stage is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    pitchDeck: {
      type: String,
    },
    videoDemo: {
      type: String,
    },
    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: [1, "Team size must be at least 1"],
    },
    launchDate: {
      type: Date,
    },
    fundingRaised: {
      type: Number,
      default: 0,
      min: [0, "Funding raised cannot be negative"],
    },
    fundingGoal: {
      type: Number,
      default: 0,
      min: [0, "Funding goal cannot be negative"],
    },
    equityOffered: {
      type: Number,
      min: [0, "Equity offered cannot be negative"],
      max: [100, "Equity offered cannot exceed 100%"],
    },
    valuation: {
      type: Number,
      min: [0, "Valuation cannot be negative"],
    },
    minInvestment: {
      type: Number,
      min: [0, "Minimum investment cannot be negative"],
    },
    revenueModel: {
      type: String,
      trim: true,
    },
    monthlyRecurringRevenue: {
      type: Number,
      min: [0, "MRR cannot be negative"],
    },
    traction: [tractionSchema],
    socials: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      github: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
    milestones: [milestoneSchema],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
startupSchema.index({ founder: 1 });
startupSchema.index({ industry: 1 });
startupSchema.index({ stage: 1 });
startupSchema.index({ isFeatured: 1 });
startupSchema.index({ createdAt: -1 });

// ─── Pre-validate Hook: Generate Slug ─────────────────────────────────────────
startupSchema.pre<IStartup>("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with single dash
      .replace(/^-+|-+$/g, ""); // Trim dashes from ends
  }
  next();
});

export const Startup = mongoose.model<IStartup>("Startup", startupSchema);
