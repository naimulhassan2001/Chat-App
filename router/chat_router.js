const express = require("express");
const { checkToken } = require("../helper/generate_token");

const {
  deleteChat,
  getFindbyuserId,
} = require("../controller/chat_controller");

const router = express.Router();

router.get("/", checkToken, getFindbyuserId);
router.delete("/:chatId", checkToken, deleteChat);

module.exports = router;
