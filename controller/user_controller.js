const express = require("express");
const UserModel = require("../model/people");
const createError = require("http-errors");
const { hash, checkPassword } = require("../services/hash_password");
const { checkToken, createToken } = require("../services/token_service");
const userService = require("../services/user_service");
const { catchError } = require("../common/error");
const password = require("../services/hash_password");
const { unlink } = require("fs");
const path = require("path");
const { sendMail } = require("../helper/email_sender");

const controller = {};

controller.createUser = catchError(async (req, res) => {
  const info = {
    type: "verification",
    name: req.body.name,
    email: req.body.email,
  };

  const isSend = await sendMail(info);

  console.log(info);

  const user = await userService.save(req);

  const accessToken = createToken(user);
  res.json({
    status: true,
    message: "User created successfully",
    data: { ...user, accessToken },
  });
});

controller.signIn = catchError(async (req, res) => {
  const user = await userService.findByEmail(req.body.email);

  const isValidPassword = await checkPassword(req.body.password, user.password);
  if (!isValidPassword) {
    throw new createError(403, "Authorization failure!");
  }

  delete user.password;
  delete user.__v;
  const accessToken = createToken(user);

  res.json({
    status: isValidPassword,
    message: "Log In successful",
    data: { ...user, accessToken },
  });
});

controller.getUser = catchError(async (req, res) => {
  const users = await userService.find();
  res.json({
    status: true,
    message: "User rectrive successfully",
    data: users,
  });
});

controller.getSingleUser = catchError(async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json({
    status: true,
    message: "User rectrive successfully",
    data: user,
  });
});

controller.changePassword = catchError(async (req, res) => {
  console.log(req.user);
  const user = await userService.findByEmail(req.user.email);

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
    status: true,
    message: "password change successfully",
    data: user,
  });
});

controller.deleteUser = catchError(async (req, res) => {
  console.log(req.user);
  const user = await userService.findByEmail(req.user.email);

  const isValidPassword = await checkPassword(req.body.password, user.password);

  if (!isValidPassword) {
    throw new createError(403, "current password is invalid");
  }

  const imagePath = user.image;
  unlink(path.join(__dirname, `../${imagePath}`), (err) => console.log(err));

  user.name = `${process.env.APP_NAME} User`;
  user.password = process.env.default_password;
  user.email = process.env.default_email;
  user.image = process.env.default_image;
  user.number = "";

  await user.save();

  user = user.toObject();

  delete user.password;
  delete user.__v;

  res.json({
    status: true,
    message: "user delete successfully",
    data: {},
  });
});

controller.editProfile = catchError(async (req, res) => {
  const name = req.body.name ? req.body.name : false;
  const email = req.body.email ? req.body.email : false;
  const number = req.body.number ? req.body.number : false;
  const image =
    req.files && req.files.length > 0 ? req.files[0].filename : false;

  if (name || email || number || image) {
    const user = await userService.findByEmail(req.user.email);
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (number) {
      user.number = number;
    }

    if (image) {
      const imagePath = user.image;
      unlink(path.join(__dirname, `../${imagePath}`), (err) =>
        console.log(err)
      );

      user.image = `uploads/users/${image}`;
    }

    await user.save();

    user = user.toObject();

    delete user.password;
    delete user.__v;

    res.json({
      status: true,
      message: "profile update successfully",
      data: user,
    });
  } else {
    throw new createError(400, "bad request");
  }
});

module.exports = controller;
