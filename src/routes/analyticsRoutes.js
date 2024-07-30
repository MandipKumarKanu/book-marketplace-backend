const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/view/:bookId", analyticsController.recordView);
router.get("/book/:bookId", auth, analyticsController.getBookAnalytics);

module.exports = router;
