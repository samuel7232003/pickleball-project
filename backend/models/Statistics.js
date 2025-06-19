const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
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
  totalPayout: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Statistics", statisticsSchema);
