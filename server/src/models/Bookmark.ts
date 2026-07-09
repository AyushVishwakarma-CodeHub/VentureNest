/**
 * Bookmark Model
 * 
 * MongoDB schema to track when users (typically investors) bookmark a startup.
 */

import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../types";

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bookmark must belong to a user"],
    },
    startup: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: [true, "Bookmark must point to a startup"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only bookmark a startup once
bookmarkSchema.index({ user: 1, startup: 1 }, { unique: true });
bookmarkSchema.index({ startup: 1 });

export const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
