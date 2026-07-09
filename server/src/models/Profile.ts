/**
 * Profile Model
 *
 * Extended user information stored separately from the User document.
 * One-to-one relationship: each User has at most one Profile.
 */

import mongoose, { Schema } from "mongoose";
import { IProfile } from "../types";

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

const experienceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    from: { type: Date, required: true },
    to: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, maxlength: 1000 },
  },
  { _id: true }
);

const educationSchema = new Schema(
  {
    school: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    from: { type: Date, required: true },
    to: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, maxlength: 1000 },
  },
  { _id: true }
);

const socialSchema = new Schema(
  {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
    facebook: { type: String, trim: true },
  },
  { _id: false }
);

// ─── Profile Schema ─────────────────────────────────────────────────────────

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
      index: true,
    },
    bio: {
      type: String,
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
      trim: true,
    },
    headline: {
      type: String,
      maxlength: [200, "Headline cannot exceed 200 characters"],
      trim: true,
    },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    phone: { type: String, trim: true },
    social: {
      type: socialSchema,
      default: () => ({}),
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 30,
        message: "You can add up to 30 skills",
      },
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 20,
        message: "You can add up to 20 interests",
      },
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    company: { type: String, trim: true },
    position: { type: String, trim: true },
    industry: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
