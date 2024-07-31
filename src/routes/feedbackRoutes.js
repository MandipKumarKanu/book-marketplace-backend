// routes/feedback.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middleware/auth");

router.post("/", auth, feedbackController.createOrUpdateFeedback);
router.delete("/delete", auth, feedbackController.deleteFeedback);
router.get("/", feedbackController.getFeedback);
router.get("/avg", feedbackController.getAverageRating);
router.get("/top", feedbackController.getTopFeedback);

module.exports = router;
