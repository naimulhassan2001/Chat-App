const express = require("express");
const UserRouter = require("./user_router");
const AuthRouter = require("./auth_router");
const ChatRouter = require("./chat_router");
const ConversationRouter = require("./conversation_router");

const mainRouter = express.Router();

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/user", UserRouter);
mainRouter.use("/chat", ChatRouter);
mainRouter.use("/conversation", ConversationRouter);

module.exports = mainRouter;
