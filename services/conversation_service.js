const Conversation = require("../model/conversation");
const createError = require("http-errors");

const service = {};

service.addConversaton = async (messageBody) => {
  try {
    const conversation = new Conversation(messageBody);
    await conversation.save();
    return conversation.populate("sender", "fullName image");
  } catch (err) {
    throw new createError(err);
  }
};
module.exports = service;
