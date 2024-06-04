const express = require("express");
const { checkToken } = require("../helper/generate_token");

const {
  getFindbyChatId,
  deleteConversation,
} = require("../controller/conversation_controller");

const router = express.Router();

router.get("/:chatId", checkToken, getFindbyChatId);
router.delete("/:chatId", checkToken, deleteConversation);

module.exports = router;
