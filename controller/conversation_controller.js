const express = require("express");
const { catchError } = require("../common/error");
const Conversation = require("../model/conversation");
const createError = require("http-errors");

const {
  findByChatId,
  deleteConversationByChatId,
} = require("../services/conversation_service");

const controller = {};

controller.getFindbyChatId = catchError(async (req, res) => {
  if (req.params.chatId.length != 24) throw createError(400, "id is invalid");

  const conversations = await findByChatId({ chat: req.params.chatId });

  res.json({
    status: true,
    message: "Conversation retrieved successfully",
    data: conversations,
  });
});

controller.deleteConversation = catchError(async (req, res) => {
  if (req.params.chatId.length != 24) throw createError(400, "id is invalid");

  const isDelete = await deleteConversationByChatId({
    chat: req.params.chatId,
  });

  if (!isDelete) {
    res.status(404).json({
      status: true,
      message: "Conversation not found",
      data: {},
    });
    return;
  }

  res.json({
    status: true,
    message: "Conversation deleted successfully",
    data: {},
  });
});

module.exports = controller;
