const invoiceModel = require("../models/Invoice");

const createInvoiceService = async (invoice) => {
  const newInvoice = await invoiceModel.create(invoice);
  return newInvoice;
};

const getInvoicePendingService = async (userId) => {
  const invoice = await invoiceModel.findOne({ userId, paymentStatus: "pending" });
  return invoice;
};

const getInvoiceService = async (invoiceId) => {
  const invoice = await invoiceModel.findOne({ _id: invoiceId });
  return invoice;
};

module.exports = { createInvoiceService, getInvoicePendingService, getInvoiceService };