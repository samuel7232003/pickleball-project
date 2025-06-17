const Statistics = require("../models/Statistics");
const courtModel  = require("../models/Court");
const accountModel = require("../models/Account");
const invoiceModel = require("../models/Invoice");

const getStatistics = async (req, res) => {
  const { _id } = req.query;
  try {
    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get counts from different collections
    const [totalCourts, totalUsers, activeBookings, monthlyRevenue] =
      await Promise.all([
        courtModel.countDocuments({ ownerId: _id }),
        accountModel.countDocuments({ role: "USER" }),
        invoiceModel.countDocuments({
          paymentStatus: { $in: ["waiting", "paid"] },
        }),
        invoiceModel.aggregate([
          {
            $match: {
              paymentStatus: "paid",
              createdAt: { $gte: firstDayOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    // Create statistics object
    const statistics = {
      totalCourts,
      totalUsers,
      activeBookings,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      lastUpdated: now,
    };

    // Update or create statistics document
    await Statistics.findOneAndUpdate({}, statistics, {
      upsert: true,
      new: true,
    });

    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

module.exports = {
  getStatistics,
};
