const express = require("express");
const { catchError } = require("../common/error");
const Chat = require("../model/chat");
const createError = require("http-errors");
const {
  deleteChatByChatId,
  findByUserId,
} = require("../services/chat_service");

const controller = {};

controller.getFindbyuserId = catchError(async (req, res) => {

  const conversations = await findByUserId({ participants: req.user._id });

  res.json({
    Status: true,
    Message: "Chat retrieved successfully",
    data: conversations,
  });
});

controller.deleteChat = catchError(async (req, res) => {
  if (req.params.chatId.length != 24) throw createError(400, "id is invalid");

  const isDelete = await deleteChatByChatId(req.params.chatId);

  if (!isDelete) {
    res.status(404).json({
      Status: true,
      Message: "Chat Room not found",
      data: {},
    });
    return;
  }

  res.json({
    Status: true,
    Message: "Chat deleted successfully",
    data: {},
  });
});

module.exports = controller;
