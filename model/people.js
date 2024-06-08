const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    number: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: "",
    },
    expireTime: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", schema);

module.exports = userModel;
