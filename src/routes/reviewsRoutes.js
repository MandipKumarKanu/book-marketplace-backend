const express = require("express");
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/:bookId/", auth, reviewController.addReview);
router.get("/:bookId/", reviewController.getReviews);
router.put("/:bookId/:reviewId", auth, reviewController.editReview);
router.delete("/:bookId/:reviewId", auth, reviewController.deleteReview);

module.exports = router;
