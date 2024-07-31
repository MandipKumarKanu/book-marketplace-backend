const User = require("../models/User");
const Badge = require("../models/Badge");

const awardBadge = async (userId, criteria) => {
  try {
    // Define badge criteria
    const badgeCriteria = {
      firstReview: "First Review",
      moreThan10Reviews: "Reviewer Extraordinaire",
      // Add other criteria as needed
    };

    const badgeName = badgeCriteria[criteria.criteria];
    if (!badgeName) {
      throw new Error("Invalid badge criteria");
    }

    const badge = await Badge.findOne({ name: badgeName });
    if (!badge) {
      throw new Error("Badge not found");
    }

    const user = await User.findById(userId);
    if (!user.badges.includes(badge._id)) {
      user.badges.push(badge._id);
      await user.save();
    }
  } catch (error) {
    console.error("Error awarding badge:", error);
  }
};

module.exports = awardBadge;