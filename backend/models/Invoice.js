const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  userId: String,
  ownerId: String,
  orderCode: String,
  amount: Number,
  paymentStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
module.exports = invoiceModel;