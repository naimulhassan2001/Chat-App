const { log } = require("../helper/logger");

const error = {};

error.catchError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(err);
      log(err, req.originalUrl);
      next(err);
    });
  };
};

error.notFoundRoute = (req, res, next) => {
  console.log(req.body);
  res.status(405).json({
    status: false,
    message: "Request not acceptable",
  });
};

error.globalRrrorHandler = (err, req, res, next) => {
  log(err, req.originalUrl);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (res.headersSent) {
    next("There was a problem");
  } else {
    res.status(statusCode).json({
      status: false,
      message: message,
      data: {},
    });
  }
};

module.exports = error;
