const mongoose = require("mongoose");
const invoiceModel = require("../models/Invoice");
const courtModel = require("../models/Court");

const getCalendarEvents = async (req, res) => {
  const { _id } = req.query;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing owner ID",
    });
  }

  try {
    const ownerObjectId = new mongoose.Types.ObjectId(_id);

    // Lấy các invoice theo ownerId và status
    let invoices = await invoiceModel.find({
      ownerId: ownerObjectId,
      paymentStatus: { $in: ["waiting", "paid"] },
    });

    // Gắn thêm courtName cho mỗi invoice (song song)
    const enrichedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const court = await courtModel.findById(invoice.courtId).lean();
        return {
          _id: invoice._id,
          courtId: invoice.courtId,
          paymentStatus: invoice.paymentStatus,
          amount: invoice.amount,
          createdAt: invoice.createdAt,
          courtName: court?.name || "Unknown",
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedInvoices,
    });
  } catch (error) {
    console.error("Error getting calendar events:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching calendar events",
    });
  }
};

module.exports = {
  getCalendarEvents,
};
