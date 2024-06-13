const express = require("express");
const UserModel = require("../model/people");
const createError = require("http-errors");
const { hash, checkPassword } = require("../services/hash_password");
const { checkToken, createToken } = require("../helper/generate_token");
const userService = require("../services/user_service");
const { catchError } = require("../common/error");
const password = require("../services/hash_password");
const { unlink } = require("fs");
const path = require("path");
const { sendMail } = require("../helper/email_sender");
const { userData } = require("../helper/remove_unnecessary_user_data");

const controller = {};

controller.createUser = catchError(async (req, res) => {
  const info = {
    type: "verification",
    name: req.body.name,
    email: req.body.email,
  };

  const isSend = await sendMail(info);

  console.log(info);

  let user = await userService.save(req);

  user = userData(user);

  const token = createToken(user);
  res.json({
    status: true,
    message: "User created successfully",
    data: { user, token },
  });
});

controller.signIn = catchError(async (req, res) => {
  let user = await userService.findByEmail(req.body.email);

  user = user.toObject();

  const isValidPassword = await checkPassword(req.body.password, user.password);
  if (!isValidPassword) {
    throw new createError(403, "Authorization failure!");
  }

  user = userData(user);

  const token = createToken(user);

  res.json({
    status: isValidPassword,
    message: "Log In successful",
    data: { user, token },
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

controller.getProfile = catchError(async (req, res) => {
  const user = await userService.findById(req.user._id);
  res.json({
    status: true,
    message: "User rectrive successfully",
    data: userData(user),
  });
});

controller.changePassword = catchError(async (req, res) => {
  console.log(req.user);
  let user = await userService.findByEmail(req.user.email);

  console.log(req.body);

  const isValidPassword = await checkPassword(
    req.body.oldPassword,
    user.toObject().password
  );

  if (!isValidPassword) {
    throw new createError(403, "current password is invalid");
  }

  user.password = await hash(req.body.newPassword);

  await user.save();

  res.json({
    status: true,
    message: "password change successfully",
    data: userData(user),
  });
});

controller.deleteUser = catchError(async (req, res) => {
  console.log(req.user);
  const user = await userService.findByEmail(req.user.email);

  const isValidPassword = await checkPassword(
    req.body.password,
    user.toObject().password
  );

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

    res.json({
      status: true,
      message: "profile update successfully",
      data: userData(user),
    });
  } else {
    throw new createError(400, "bad request");
  }
});

controller.sendOtp = catchError(async (req, res) => {
  const user = await userService.findByEmail(req.body.email);

  const info = {
    type: "forget-password",
    name: user.name,
    email: req.body.email,
  };

  const otp = await sendMail(info);

  user.otp = otp;
  user.expireTime = new Date(Date.now() + 3 * 60 * 1000);

  await user.save();

  res.json({
    status: true,
    message: "otp send successfully",
    data: userData(user),
  });
});

controller.verifyOtp = catchError(async (req, res) => {
  console.log(req.body);
  let user = await userService.findByEmail(req.body.email);

  user = user.toObject();

  const userOtp = user.otp;
  const requestOtp = req.body.otp;
  const currentTime = new Date();

  if (userOtp !== requestOtp) {
    return res.status(404).json({
      status: false,
      message: "OTP is invalid",
      data: {},
    });
  }

  if (user.expireTime && currentTime > user.expireTime) {
    return res.status(404).json({
      status: false,
      message: "OTP has expired",
      data: {},
    });
  }

  user = userData(user);

  const { accessToken } = createToken(user, "3m");

  res.json({
    status: true,
    message: "OTP verified successfully",
    data: { forgetPasswordToken: accessToken },
  });
});

controller.resetPassword = catchError(async (req, res) => {
  const user = await userService.findByEmail(req.body.email);
  user.password = await hash(req.body.password);

  await user.save();

  res.json({
    status: true,
    message: "Password update successfully",
    data: userData(user),
  });
});

module.exports = controller;
