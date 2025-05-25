const invoiceModel = require("../models/Invoice");

const createInvoiceService = async (invoice) => {
  const newInvoice = await invoiceModel.create(invoice);
  return newInvoice;
};

module.exports = { createInvoiceService };