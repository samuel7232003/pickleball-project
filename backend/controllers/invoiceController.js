const { createInvoiceItemsService } = require("../services/invoiceItemService");
const { createInvoiceService } = require("../services/invoiceService");


const createInvoice = async (req, res) => {
  try{  
    const { userId, ownerId, timeChoice } = req.body;
    const newInvoice = await createInvoiceService({ userId, ownerId, paymentStatus: "pending" });

    const invoiceItems = timeChoice.map((item) => {
      const { _id, dateChoiced, numberChoie } = item;
      return ({
      invoiceId: newInvoice._id,
      timeslotId: _id,
      dateChoiced,
      numberChoie,
    })});

    await createInvoiceItemsService(invoiceItems);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInvoice };