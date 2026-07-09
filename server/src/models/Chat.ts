/**
 * Chat Model
 * 
 * MongoDB schema for tracking direct messaging rooms (chats) between users.
 */

import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
chatSchema.index({ participants: 1 });

export const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
