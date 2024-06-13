const { check, validationResult } = require("express-validator");
const User = require("../model/people");
const createError = require("http-errors");

const validation = {};

validation.signUpValidation = [
  check("name").notEmpty().withMessage("Name is required").trim(),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        console.log(user);
        if (user) {
          throw createError("Email already is exit");
        }
      } catch (err) {
        throw createError("email is already exit");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be least 8 characters")
    .trim(),

  check("number").isString().withMessage("invalid phone number").trim(),
];

validation.signInValidation = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .trim(),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be least 8 characters")
    .trim(),
];

validation.changePasswordValidation = [
  check("oldPassword")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be least 8 characters")
    .trim(),

  check("newPassword")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be least 8 characters")
    .trim(),
];

validation.deleteAccountValidation = [
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be least 8 characters")
    .trim(),
];

validation.editProfileValidation = [
  check("name").isString().withMessage("Name is required").trim(),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        console.log(user);
        if (user) {
          throw createError("Email already is exit");
        }
      } catch (err) {
        throw createError("email is already exit");
      }
    }),

  

  check("number").isString().withMessage("invalid phone number").trim(),
];


validation.validationHandler = (req, res, next) => {
  const err = validationResult(req);
  const errors = err.mapped();
  console.log(errors);
  if (Object.keys(errors).length === 0) {
    next();
  } else {
    console.log(errors);

    res.status(403).json({
      Status: false,
      Message: "Authorization failure!",
      data: errors,
    });
  }
};

module.exports = validation;
