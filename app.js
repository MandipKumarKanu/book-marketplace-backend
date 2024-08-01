const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hi, there!!!");
});

// Routes
const userRoutes = require("./src/routes/userRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const recommendationsRoute = require("./src/routes/recommendationsRoute");
const reviewsRoutes = require("./src/routes/reviewsRoutes");
const feedBackRoutes = require("./src/routes/feedbackRoutes");
const badgesRoute = require("./src/routes/badgesRoute");

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/recommendation", recommendationsRoute);
app.use("/api/review", reviewsRoutes);
app.use("/api/feedback", feedBackRoutes);
app.use("/api/badges", badgesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
