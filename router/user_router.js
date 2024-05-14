const express = require("express");
const { imageUpload } = require("../multer/file_upload");

const { getUser, getSingleUser } = require("../controller/user_controller");

const router = express.Router();

router.get("/", getUser);
router.get("/:id", getSingleUser);

module.exports = router;
