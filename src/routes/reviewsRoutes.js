const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/:bookId", reviewController.addReview);
router.get("/:bookId", reviewController.getReviews);

module.exports = router;
