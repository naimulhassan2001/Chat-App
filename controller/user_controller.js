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

controller.deleteUser = catchError(async (req, res) => {
  console.log(req.user);
  let user = await userService.findByEmail(req.user.email);

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
    Status: true,
    Message: "user delete successfully",
  });
});

controller.editProfile = catchError(async (req, res) => {
  const name = req.body.name ? req.body.name : false;
  const email = req.body.email ? req.body.email : false;
  const number = req.body.number ? req.body.number : false;
  const image =
    req.files && req.files.length > 0 ? req.files[0].filename : false;

  if (name || email || number || image) {
    let user = await userService.findByEmail(req.user.email);
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
      Status: true,
      Message: "profile update successfully",
      data: user,
    });
  } else {
    throw new createError(400, "bad request");
  }
});

module.exports = controller;
