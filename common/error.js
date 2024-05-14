

const error = {};

error.catchError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(err);
      next(err);
    });
  };
};

error.notFoundRoute = (req, res, next) => {
  res.status(405).json({
    Status: false,
    Message: "Request not acceptable",
  });
};

error.globalRrrorHandler = (err, req, res, next) => {
  console.log("Global error handler middleware call");

  console.log(err.statusCode);
  console.log(err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (res.headersSent) {
    next("There was a problem");
  } else {
    res.status(statusCode).json({
      Status: false,
      Message: message,
      data: {},
    });
  }
};

module.exports = error;
