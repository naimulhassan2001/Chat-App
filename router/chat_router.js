const express = require("express");
const { checkToken } = require("../services/token_service");

const {
  deleteChat,
  getFindbyuserId,
} = require("../controller/chat_controller");

const router = express.Router();

router.get("/", checkToken, getFindbyuserId);
router.delete("/:chatId", checkToken, deleteChat);

module.exports = router;
