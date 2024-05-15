const Chat = require("../model/chat");
const { hash, checkPassword } = require("../services/hash_password");
const createError = require("http-errors");

const service = {};

service.addChat = async (chatData) => {
  try {
    const chat = new Chat(chatData);
    const newChat = await chat.save();
    return newChat;
  } catch (err) {
    console.log(err);
    throw new createError(err);
  }
};

service.getChatByParticipants = async (data) => {
  try {
    const filters = {
      participants: {
        $all: data.participants,
      },
      type: !data.type ? "single" : data.type,
    };
    if (data.groupName) {
      filters.groupName = data.groupName;
    }
    const chatRoom = await Chat.findOne(filters);
    return chatRoom;
  } catch (error) {
    throw error;
  }
};

module.exports = service;
