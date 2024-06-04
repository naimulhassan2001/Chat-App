const jwt = require("jsonwebtoken");
const express = require("express");
const createError = require("http-errors");

const service = express();

service.createToken = (data) => {
  const accessToken = jwt.sign(data, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });

  const token = { accessToken, refreshToken };

  return token;
};

service.checkToken = (req, res, next) => {
  const { authorization, Cookie } = req.headers;

  console.log(' header Cookie:', Cookie);

  const userCookie = req.cookies['yourCookieName'];
    console.log('Cookie:', userCookie);

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

module.exports = service;
