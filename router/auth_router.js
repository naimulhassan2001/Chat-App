const express = require("express");
const { imageUpload } = require("../multer/file_upload");

const {
  createUser,
  signIn,
  changePassword,
  deleteUser,
} = require("../controller/user_controller");

const {
  changePasswordValidation,
  signInValidation,
  signUpValidation,
  deleteAccountValidation,
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

router.delete(
  "/delete-account",
  checkToken,
  deleteAccountValidation,
  checkValidation,
  deleteUser
);

module.exports = router;
