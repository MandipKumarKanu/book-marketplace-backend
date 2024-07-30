const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
