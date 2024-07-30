const express = require("express");
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", auth, categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);
router.get("/:categoryId/books", categoryController.getBooksByCategory);

module.exports = router;
