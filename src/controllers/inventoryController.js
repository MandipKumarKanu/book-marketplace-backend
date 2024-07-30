const Inventory = require("../models/Inventory");

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ bookId: req.params.bookId });
    if (!inventory) return res.status(404).send("Inventory not found");
    res.json(inventory);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { stock, threshold } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { bookId: req.params.bookId },
      { stock, threshold, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(inventory);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
