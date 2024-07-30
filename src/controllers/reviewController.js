const Book = require("../models/Book");

exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId, rating, comment } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send("Book not found");

    book.reviews.push({ userId, rating, comment });
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate("reviews.userId", "name");
    if (!book) return res.status(404).send("Book not found");

    res.json(book.reviews);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
