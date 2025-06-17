const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  userId: String,
  ownerId: String,
  courtId: String,
  orderCode: String,
  amount: Number,
  paymentStatus: String,
  timeStartWaiting: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
module.exports = invoiceModel;