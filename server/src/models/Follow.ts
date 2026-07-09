/**
 * Follow Model
 * 
 * MongoDB schema to track follow relationships. 
 * Allows users to follow other users (e.g. founders, mentors) or startups.
 */

import mongoose, { Schema } from "mongoose";
import { IFollow } from "../types";

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follower is required"],
    },
    followingType: {
      type: String,
      enum: ["user", "startup"],
      required: [true, "Following type is required"],
    },
    followingUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function (this: IFollow) {
        return this.followingType === "user";
      },
    },
    followingStartup: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: function (this: IFollow) {
        return this.followingType === "startup";
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance and preventing duplicates
followSchema.index({ follower: 1, followingType: 1, followingUser: 1 }, { 
  unique: true,
  partialFilterExpression: { followingUser: { $exists: true } }
});

followSchema.index({ follower: 1, followingType: 1, followingStartup: 1 }, { 
  unique: true,
  partialFilterExpression: { followingStartup: { $exists: true } }
});

followSchema.index({ followingUser: 1 });
followSchema.index({ followingStartup: 1 });

export const Follow = mongoose.model<IFollow>("Follow", followSchema);
