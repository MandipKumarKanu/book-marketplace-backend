const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/add", auth, wishlistController.addToWishlist);
router.delete("/remove/:bookId", auth, wishlistController.removeFromWishlist);
router.get("/", auth, wishlistController.getWishlist);
router.delete("/clear", auth, wishlistController.clearWishlist);
router.get("/check/:bookId", auth, wishlistController.isInWishlist);

module.exports = router;
