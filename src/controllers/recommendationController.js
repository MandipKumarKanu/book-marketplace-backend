const Book = require("../models/Book");

exports.getRecommendations = async (req, res) => {
  try {
    const { genre, limit = 5 } = req.query; 
    const recommendations = await Book.find({ genre }).limit(parseInt(limit));
    res.json(recommendations);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
