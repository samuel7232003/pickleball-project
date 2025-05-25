const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  invoiceId: String,
  timeslotId: String,
  price: Number,
  dateChoiced: String,
  numberChoie: Number,
});

const invoiceItemModel = mongoose.model("InvoiceItem", invoiceItemSchema);
module.exports = invoiceItemModel;