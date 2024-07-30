const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/send", auth, messageController.sendMessage);
router.get("/conversations", auth, messageController.getConversations);
router.get("/messages/:otherUserId", auth, messageController.getMessages);
router.delete("/messages/:messageId", auth, messageController.deleteMessage);
router.get("/unread", auth, messageController.getUnreadCount);

module.exports = router;
