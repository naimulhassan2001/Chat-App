const express = require("express");
const UserModel = require("../model/people");
const createError = require("http-errors");
const { hash, checkPassword } = require("../services/hash_password");
const { checkToken, createToken } = require("../services/token_service");
const userService = require("../services/user_service");
const { catchError } = require("../common/error");
const password = require("../services/hash_password");

const controller = express();

controller.createUser = catchError(async (req, res) => {
  const User = await userService.save(req);
  console.log(User);
  res.json({
    Status: true,
    Message: "User created successfully",
    data: User,
  });
});

controller.signIn = catchError(async (req, res) => {
  let user = await userService.findByEmail(req.body.email);

  user = user.toObject();

  const isValidPassword = await checkPassword(req.body.password, user.password);
  if (!isValidPassword) {
    throw new createError(403, "Authorization failure!");
  }

  const accessToken = createToken(user);

  delete user.password;
  delete user.__v;

  res.json({
    Status: isValidPassword,
    Message: "Log In successful",
    data: { ...user, accessToken },
  });
});

controller.getUser = catchError(async (req, res) => {
  const users = await userService.find();
  res.json({
    Status: true,
    Message: "User rectrive successfully",
    data: users,
  });
});

controller.getSingleUser = catchError(async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json({
    Status: true,
    Message: "User rectrive successfully",
    data: user,
  });
});

controller.changePassword = catchError(async (req, res) => {
  console.log(req.user);
  let user = await userService.findByEmail(req.user.email);

  const isValidPassword = await checkPassword(req.body.password, user.password);

  if (!isValidPassword) {
    throw new createError(403, "current password is invalid");
  }

  user.password = await hash(req.body.newPassword);

  await user.save();

  user = user.toObject();

  delete user.password;
  delete user.__v;

  res.json({
    Status: true,
    Message: "password change successfully",
    data: user,
  });
});

module.exports = controller;
