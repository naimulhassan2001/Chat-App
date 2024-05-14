const express = require("express");
const UserRouter = require("./user_router");
const AuthRouter = require("./auth_router");

const mainRouter = express.Router();

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/user", UserRouter);

module.exports = mainRouter;
