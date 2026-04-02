const express = require("express");
const { getMessages, createMessage } = require("../Controllers/messageController");

const router = express.Router();

router.get("/:itemId", getMessages);
router.post("/", createMessage);

module.exports = router;
