const Chat = require("../model/chat");
const { hash, checkPassword } = require("../services/hash_password");
const createError = require("http-errors");
const mongoose = require("mongoose");

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
    if (data.name) {
      filters.name = data.name;
    }
    const chatRoom = await Chat.findOne(filters);
    return chatRoom;
  } catch (error) {
    throw error;
  }
};

service.getChatById = async (chatId) => {
  try {
    return await Chat.findById(chatId);
  } catch (error) {
    throw error;
  }
};

service.getChatByParticipantId = async (filters) => {
  try {
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const chatList = await Chat.find(filters).sort({ updatedAt: -1 });

    const totalResults = await Chat.countDocuments(filters);
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };

    return { chatList, pagination };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
