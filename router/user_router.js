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
} = require("../controller/user_controller");

const router = express.Router();

router.get("/", getUser);
router.get("/:id", getSingleUser);
router.patch("/edit-profile", checkToken, imageUpload, editProfile);

module.exports = router;
