const invoiceItemModel = require("../models/InvoiceItem");

const createInvoiceItemsService = async (invoiceItems) => {
  const newInvoiceItem = await invoiceItemModel.insertMany(invoiceItems);
  return newInvoiceItem;
};

const getInvoiceItemsService = async (invoiceId) => {
  const invoiceItems = await invoiceItemModel.find({ invoiceId });
  return invoiceItems;
};

const getInvoiceItemsByTimeslotIdService = async (timeslotId, date, numChoie) => {
  const invoiceItems = await invoiceItemModel.find({ timeslotId, dateChoiced: date, numberChoie: numChoie });
  return invoiceItems;
};

module.exports = {
  createInvoiceItemsService,
  getInvoiceItemsService,
  getInvoiceItemsByTimeslotIdService,
};
