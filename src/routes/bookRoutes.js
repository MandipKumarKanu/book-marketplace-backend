const express = require("express");
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/search", bookController.searchBooks);
router.post('/purchase/:id', auth, bookController.purchaseBook);
router.post("/", auth, upload.array("images", 5), bookController.createBook);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.put("/:id", auth, upload.array("images", 5), bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);
router.get("/user/books", auth, bookController.getUserBooks);
router.get("/user/stats", auth, bookController.getUserBookStats);

module.exports = router;
