const jwt = require("jsonwebtoken");
const express = require("express");
const createError = require("http-errors");

const service = express();

service.createToken = (data, expiresIn = "1h") => {
  console.log(expiresIn);
  const accessToken = jwt.sign(data, process.env.JWT_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });

  const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });

  const token = { accessToken, refreshToken };

  return token;
};

service.checkToken = (req, res, next) => {
  const { authorization } = req.headers;

  const userCookie = req.cookies["yourCookieName"];
  console.log("Cookie:", userCookie);

  console.log(authorization);

  if (authorization) {
    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch {
      next(createError(401, "Authorization failure!"));
    }
  } else {
    next(createError(401, "Authorization failure!"));
  }
};
service.check = async (req, res, next) => {
  try {
    var forgetPasswordToken;
    if (
      req.headers["forget-password"] &&
      req.headers["forget-password"].startsWith("Forget-password ")
    ) {
      forgetPasswordToken = req.headers["forget-password"].split(" ")[1];
    }
    if (!forgetPasswordToken) {
      return res.status(400).json({
        status: "Error",
        statusCode: "400",
        type: "user",
        message: "unauthorised",
      });
    }

    const tokenData = jwt.verify(
      forgetPasswordToken,
      process.env.JWT_TOKEN_SECRET
    );
    if (!tokenData) {
      return res.status(400).json(
        response({
          status: "Error",
          statusCode: "400",
          type: "user",
          message: "invalid-token",
        })
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = service;
