const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, books: [] });
    }

    if (wishlist.books.includes(bookId)) {
      return res.status(400).json({ message: "Book already in wishlist" });
    }

    wishlist.books.push(bookId);
    await wishlist.save();

    res.status(200).json({ message: "Book added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.books = wishlist.books.filter(
      (book) => book.toString() !== bookId
    );
    await wishlist.save();

    res.status(200).json({ message: "Book removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ user: userId }).populate("books");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.books = [];
    await wishlist.save();

    res.status(200).json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.isInWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({ isInWishlist: false });
    }

    const isInWishlist = wishlist.books.includes(bookId);

    res.status(200).json({ isInWishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
