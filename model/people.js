const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    number: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      eunm: ["user", "Admin"],
      required: true,
      default: "user",
    },
  },

  {
    timestamp: true,
  }
);

const userModel = new mongoose.model("User", schema);

module.exports = userModel;
