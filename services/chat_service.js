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

service.getChatById = async (id) => {
  if (id.length != 24) throw createError(400, "id is invalid");
  try {
    return await Chat.findById(id);
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

    const totalResults = await Chat.countDocuments(filters).p;
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };

    return { chatList, pagination };
  } catch (error) {
    console.error(error);
    throw new createError(err);
  }
};

service.findByUserId = async (filters) => {
  try {
    const conversations = await Chat.find(filters).sort({
      updatedAt: -1,
    });
    return conversations;
  } catch (err) {
    throw new createError(err);
  }
};

service.deleteChatByChatId = async (id) => {
  try {
    const isDelete = await Chat.findByIdAndDelete(id);

    console.log(isDelete);

    if (!isDelete) {
      return false;
    }

    return true;
  } catch (err) {
    throw new createError(err);
  }
};

module.exports = service;
