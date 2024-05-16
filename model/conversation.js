const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageType: {
      type: String,
      enum: ["message", "notice"],
      default: "message",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", messageSchema);
