const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: String,
    originalPrice: { type: Number, required: true },
    offeredPrice: { type: Number, required: true },
    purpose: { type: String, enum: ["sell", "donate", "rent"], required: true },
    status: {
      type: String,
      enum: ["available", "sold", "rented", "not-available"],
      default: "available",
    },
    images: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [reviewSchema],
    ratings: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number }],
    publicationYear: Number,
    genre: String,
    tags: String,
    // condition: {
    //   type: String,
    //   enum: ["new", "like new", "used", "poor"],
    //   required: true,
    // },
    language: String,
    edition: String,
    purchasedDate: Date,
    isbn: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    criteria: { type: String, required: true },
  },
  { timestamps: true }
);

bookSchema.methods.getAverageRating = function () {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / this.reviews.length;
};

module.exports = mongoose.model("Book", bookSchema);
