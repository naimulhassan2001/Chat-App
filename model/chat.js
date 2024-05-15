const mongoose = require("mongoose");

const lastMessage = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Prevent creating an _id field for this subdocument
);

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    name: {
      type: String,
      default: "unknown",
    },
    type: {
      type: String,
      enum: ["group", "single", "channel"],
      default: "single",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    lastMessage: {
      type: lastMessage,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Chat", chatSchema);
