const invoiceItemModel = require("../models/InvoiceItem");

const createInvoiceItemsService = async (invoiceItems) => {
  const newInvoiceItem = await invoiceItemModel.insertMany(invoiceItems);
  return newInvoiceItem;
};

module.exports = { createInvoiceItemsService };