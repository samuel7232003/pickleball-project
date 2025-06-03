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

const setDoneInvoiceService = async (orderCode)=>{
  try {
      const responce = await invoiceModel.updateOne(
          {orderCode: orderCode},
          { $set: {paymentStatus: "PAID"}}
      )
      return responce;
  } catch (error) {
      console.log(error);
      return null;
  }
}

module.exports = { createInvoiceService, getInvoicePendingService, getInvoiceService, setDoneInvoiceService };