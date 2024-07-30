const Analytics = require("../models/Analytics");
const Book = require("../models/Book");

exports.recordView = async (req, res) => {
  try {
    const { bookId } = req.params;
    let analytics = await Analytics.findOne({
      book: bookId,
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    if (!analytics) {
      analytics = new Analytics({ book: bookId });
    }

    analytics.views += 1;
    await analytics.save();

    res.status(200).json({ message: "View recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookAnalytics = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { book: bookId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const analytics = await Analytics.find(query);

    const totalViews = analytics.reduce((sum, record) => sum + record.views, 0);
    const totalRevenue = analytics.reduce(
      (sum, record) => sum + record.revenue,
      0
    );

    res.status(200).json({ totalViews, totalRevenue, analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
