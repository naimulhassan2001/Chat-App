const express = require("express");
const { imageUpload } = require("../multer/file_upload");

const {
  getUser,
  createUser,
  getSingleUser,
  signIn,
  changePassword,
} = require("../controller/user_controller");

const {
  changePasswordValidation,
  signInValidation,
  signUpValidation,
  validationHandler,
} = require("../vaildation/user_validation");

const { checkValidation } = require("../common/validationHandler");
const { checkToken } = require("../services/token_service");

const router = express.Router();

router.post(
  "/sign-up",
  imageUpload,
  signUpValidation,
  checkValidation,
  createUser
);

router.post("/sign-in", signInValidation, validationHandler, signIn);

router.patch(
  "/change-password",
  checkToken,
  changePasswordValidation,
  checkValidation,
  changePassword
);

module.exports = router;
