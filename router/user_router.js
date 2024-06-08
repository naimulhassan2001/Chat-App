const express = require("express");
const { imageUpload } = require("../multer/file_upload");

const {
  editProfileValidation,
  validationHandler,
} = require("../vaildation/user_validation");
const { checkToken } = require("../helper/generate_token");

const {
  getUser,
  getSingleUser,
  editProfile,
  getProfile,
} = require("../controller/user_controller");

const router = express.Router();

router.get("/profile", checkToken, getProfile);

router.get("/:id", getSingleUser);
router.patch("/edit-profile", checkToken, imageUpload, editProfile);
router.get("/", checkToken, getUser);

module.exports = router;
