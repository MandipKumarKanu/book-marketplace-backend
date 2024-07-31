const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("badges");
    res.json(user.badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
