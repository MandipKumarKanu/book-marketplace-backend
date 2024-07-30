const Cart = require("../models/Cart");
const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");

exports.addToCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    console.log(book, book.status);
    if (book.status === "sold" || book.status === "sold") {
      return res.status(400).json({ error: "Book is already sold" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    let bookup = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        status: "not-available",
      }
    );

    const existingItem = cart.items.find(
      (item) => item.book.toString() === bookId
    );

    if (existingItem) {
      return res.status(404).json({ error: "Already added to someone's cart" });
    } else {
      cart.items.push({ book: bookId });
    }

    await cart.save();
    await bookup.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let bookup = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        status: "available",
      }
    );

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    await cart.save();
    await bookup.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const purchasedBooks = [];

    for (const item of cart.items) {
      const book = await Book.findById(item.book._id);

      if (!book) {
        return res
          .status(404)
          .json({ error: `Book with ID ${item.book._id} not found` });
      }

      if (book.status === "sold" || book.status === "rented") {
        return res
          .status(400)
          .json({ error: `Book '${book.title}' is no longer available` });
      }

      book.status = "sold";
      book.purchasedDate = new Date();
      book.buyer = userId;
      await book.save();

      purchasedBooks.push(book._id);
    }

    await User.findByIdAndUpdate(userId, {
      $push: { purchasedBooks: { $each: purchasedBooks } },
    });

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    res.status(200).json({
      message: "Checkout successful, books marked as sold",
      purchasedBooks: purchasedBooks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
