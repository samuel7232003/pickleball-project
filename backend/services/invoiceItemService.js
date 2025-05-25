const invoiceItemModel = require("../models/InvoiceItem");

const createInvoiceItemsService = async (invoiceItems) => {
  const newInvoiceItem = await invoiceItemModel.insertMany(invoiceItems);
  return newInvoiceItem;
};

const getInvoiceItemsService = async (invoiceId) => {
  const invoiceItems = await invoiceItemModel.find({ invoiceId });
  return invoiceItems;
};

module.exports = { createInvoiceItemsService, getInvoiceItemsService };