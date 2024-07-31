const Book = require("../models/Book");
const mongoose = require("mongoose");

exports.createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      originalPrice,
      offeredPrice,
      purpose,
      condition,
      isbn,
      status,
    } = req.body;
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const book = new Book({
      title,
      author,
      description,
      originalPrice,
      offeredPrice,
      purpose,
      condition,
      isbn,
      status: status || "available",
      images,
      owner: req.user.userId,
    });

    await book.save();
    res
      .status(201)
      .json({ message: "Book listing created successfully", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("owner", "username email");
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "owner",
      "username email"
    );
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.owner.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own book listings" });
    }

    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => file.path);
    }

    Object.assign(book, updates);
    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.owner.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own book listings" });
    }

    await Book.deleteOne({ _id: req.params.id });
    res.json({ message: "Book listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: "$purpose",
          count: { $sum: 1 },
          totalOriginalPrice: { $sum: "$originalPrice" },
          totalOfferedPrice: { $sum: "$offeredPrice" },
        },
      },
    ]);

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalOriginalPrice: stat.totalOriginalPrice,
        totalOfferedPrice: stat.totalOfferedPrice,
      };
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, isbn } = req.query;

    if (!title && !author && !isbn) {
      return res
        .status(400)
        .json({ error: "At least one search query parameter is required" });
    }

    const searchCriteria = {};

    if (title) {
      searchCriteria.title = { $regex: title, $options: "i" };
    }
    if (author) {
      searchCriteria.author = { $regex: author, $options: "i" };
    }
    if (isbn) {
      searchCriteria.isbn = { $regex: isbn, $options: "i" };
    }

    const books = await Book.find(searchCriteria).populate(
      "owner",
      "username email"
    );
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.purchaseBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.status !== "available") {
      return res
        .status(400)
        .json({ error: "Book is not available for purchase" });
    }

    book.status = "sold";
    book.buyer = userId;
    await book.save();

    res.json({ message: "Book purchased successfully", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkoutWithESEWA = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const transactionId = crypto.randomBytes(16).toString("hex");
    const totalAmount = book.offeredPrice; 

    const paymentData = {
      amount: totalAmount,
      type: "M",
      productName: `Purchase of ${book.title}`,
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
      orderId: transactionId,
      callbackUrl: `${process.env.ESEWA_CALLBACK_URL}?orderId=${transactionId}`,
    };

    res.json({ paymentData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleESEWACallback = async (req, res) => {
  try {
    const { orderId, amount, referenceId, status } = req.query;

    if (status === "Success") {
      const book = await Book.findOne({ orderId: orderId });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      book.status = "sold";
      book.buyer = req.user.userId;
      await book.save();

      res.json({ message: "Payment successful and book purchased" });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByPageAndLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .populate("owner", "username email")
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments();

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.advSearchBooks = async (req, res) => {
  try {
    const { title, author, isbn, genre, condition, minPrice, maxPrice, tags } =
      req.query;
    const searchCriteria = {};

    if (title) {
      searchCriteria.title = { $regex: title, $options: "i" };
    }
    if (author) {
      searchCriteria.author = { $regex: author, $options: "i" };
    }
    if (isbn) {
      searchCriteria.isbn = { $regex: isbn, $options: "i" };
    }
    if (genre) {
      searchCriteria.genre = genre;
    }
    if (condition) {
      searchCriteria.condition = condition;
    }
    if (minPrice) {
      searchCriteria.offeredPrice = {
        ...searchCriteria.offeredPrice,
        $gte: minPrice,
      };
    }
    if (maxPrice) {
      searchCriteria.offeredPrice = {
        ...searchCriteria.offeredPrice,
        $lte: maxPrice,
      };
    }
    if (tags) {
      searchCriteria.tags = { $in: tags.split(",") };
    }

    const books = await Book.find(searchCriteria).populate(
      "owner",
      "username email"
    );
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
