const { validationResult } = require("express-validator");
const { unlink } = require("fs");
const path = require("path");

const handler = {};

handler.checkValidation = (req, res, next) => {
  const err = validationResult(req);
  const errors = err.mapped();
  console.log(errors);
  if (Object.keys(errors).length === 0) {
    next();
  } else {
    if (req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(path.join(__dirname, `../uploads/users/${filename}`), (err) =>
        console.log(err)
      );
    }

    console.log(errors);

    if (
      Object.keys(errors).includes("email") &&
      errors.email.msg === "email is already exit"
    ) {
      res.status(409).json({
        Status: false,
        Message: errors.email.msg,
        errors: errors.email,
      });
      return;
    }

    if (Object.keys(errors).length === 1) {
      const filedName = Object.keys(errors)[0];

      console.log(filedName);
      console.log(errors[filedName].msg);

      res.status(400).json({
        Status: false,
        Message: errors[filedName].msg,
        errors: errors,
      });

      return;
    }

    res.status(400).json({
      Status: false,
      Message: "error",
      errors: errors,
    });
  }
};

module.exports = handler;
