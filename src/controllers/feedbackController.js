// controllers/feedbackController.js
const Feedback = require("../models/Feedback");

exports.createOrUpdateFeedback = async (req, res) => {
  try {
    // console.log(req.user)
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    let feedback = await Feedback.findOne({ userId });

    if (feedback) {
      // Update existing feedback
      feedback.rating = rating;
      feedback.comment = comment;
      feedback.updatedAt = Date.now();
    } else {
      // Create new feedback
      feedback = new Feedback({ userId, rating, comment });
    }

    await feedback.save();
    res.status(200).json({ message: "Feedback saved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("userId", "name");
    res.json(feedback);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;

    const feedback = await Feedback.findOneAndDelete({ userId });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    if (feedback.length === 0) return res.json({ averageRating: 0 });

    const total = feedback.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = (total / feedback.length).toFixed(1);

    res.json({ averageRating });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getTopFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "name")
      .sort({ rating: -1 })
      .limit(5); // Adjust the limit as needed
    res.json(feedback);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
