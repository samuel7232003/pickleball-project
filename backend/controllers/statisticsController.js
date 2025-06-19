const Statistics = require("../models/Statistics");
const courtModel  = require("../models/Court");
const accountModel = require("../models/Account");
const invoiceModel = require("../models/Invoice");

const getStatistics = async (req, res) => {
  const { _id: ownerId } = req.query;

  try {
    if (!ownerId) {
      return res.status(400).json({ message: "Missing ownerId in query" });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCourts, totalUsers, activeBookings, monthlyRevenue] =
      await Promise.all([
        courtModel.countDocuments({ ownerId }),
        accountModel.countDocuments({ role: "USER" }),
        invoiceModel.countDocuments({
          ownerId, // Only count bookings for this owner
          paymentStatus: { $in: ["waiting", "paid"] },
        }),
        invoiceModel.aggregate([
          {
            $match: {
              ownerId,
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

    const statistics = {
      ownerId,
      totalCourts,
      totalUsers,
      activeBookings,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      lastUpdated: now,
    };

    // Create or update statistics record for this owner
    await Statistics.findOneAndUpdate(
      { ownerId }, // Ensure per-owner stats
      statistics,
      { upsert: true, new: true }
    );

    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};


module.exports = {
  getStatistics,
};
