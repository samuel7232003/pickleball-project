const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  totalCourts: {
    type: Number,
    default: 0,
  },
  activeBookings: {
    type: Number,
    default: 0,
  },
  monthlyRevenue: {
    type: Number,
    default: 0,
  },
  totalUsers: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Statistics", statisticsSchema);
