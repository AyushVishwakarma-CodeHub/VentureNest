/**
 * Message Model
 * 
 * MongoDB schema for tracking individual chat messages.
 */

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Message must belong to a chat room"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Message must have a sender"],
    },
    text: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
messageSchema.index({ chat: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
export default Message;
