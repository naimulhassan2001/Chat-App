const Conversation = require("../model/conversation");
const createError = require("http-errors");

const service = {};

service.addConversaton = async (messageBody) => {
  try {
    const conversation = new Conversation(messageBody);
    await conversation.save();
    return conversation.populate("sender", "name image");
  } catch (err) {
    throw new createError(err);
  }
};

service.findByChatId = async (filters) => {
  try {
    const conversations = await Conversation.find(filters).populate('sender', 'name image').sort({
      createdAt: -1,
    });
    return conversations;
  } catch (err) {
    throw new createError(err);
  }
};

service.deleteConversationByChatId = async (filters) => {
  try {
    const conversations = await Conversation.deleteMany(filters);

    if (!conversations.deletedCount > 0) {
      return false;
    }

    return true;
  } catch (err) {
    throw new createError(err);
  }
};

module.exports = service;
