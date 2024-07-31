const Book = require("../models/Book");
const awardBadge = require("../utils/awardBadge");

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId, rating, comment } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send("Book not found");

    book.reviews.push({ userId, rating, comment });
    await book.save();

    const reviewCount = book.reviews.filter(
      (review) => review.userId.toString() === userId
    ).length;
    if (reviewCount === 1) {
      await awardBadge(userId, { criteria: "firstReview" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get reviews of a book
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

// Edit a review
exports.editReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const { userId, rating, comment } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send("Book not found");

    const review = book.reviews.id(reviewId);
    if (!review) return res.status(404).send("Review not found");

    if (review.userId.toString() !== userId) {
      return res.status(403).send("You can only edit your own reviews");
    }

    review.rating = rating;
    review.comment = comment;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const { userId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send("Book not found");

    const review = book.reviews.id(reviewId);
    if (!review) return res.status(404).send("Review not found");

    if (review.userId.toString() !== userId) {
      return res.status(403).send("You can only delete your own reviews");
    }

    review.remove();
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
