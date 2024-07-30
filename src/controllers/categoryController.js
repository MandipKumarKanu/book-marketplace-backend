const Category = require("../models/Category");
const Book = require("../models/Book");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    const category = new Category({ name, description, parent });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, parent },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBooksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const books = await Book.find({ category: categoryId }).populate(
      "category"
    );
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
