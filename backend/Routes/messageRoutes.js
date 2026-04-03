const express = require("express");
const { getMessages, createMessage, getItemConversations } = require("../Controllers/messageController");

const router = express.Router();

router.get("/:itemId", getMessages);
router.get("/:itemId/conversations", getItemConversations);
router.post("/", createMessage);

module.exports = router;
