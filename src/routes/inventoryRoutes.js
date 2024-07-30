const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.get("/:bookId", inventoryController.getInventory);
router.put("/:bookId", inventoryController.updateInventory);

module.exports = router;
