const { getCourtService } = require("../services/courtService");
const {
  createInvoiceItemsService,
  getInvoiceItemsService,
} = require("../services/invoiceItemService");
const {
  createInvoiceService,
  getInvoicePendingService,
} = require("../services/invoiceService");
const { getTimeslotService } = require("../services/timeslotService");

const createInvoice = async (req, res) => {
  try {
    const { userId, ownerId, timeChoice, orderCode, amount } = req.body;
    const newInvoice = await createInvoiceService({
      userId,
      ownerId,
      orderCode,
      amount,
      paymentStatus: "pending",
    });

    const invoiceItems = timeChoice.map((item) => {
      const { _id, dateChoiced, numberChoie } = item;
      return {
        invoiceId: newInvoice._id,
        timeslotId: _id,
        dateChoiced,
        numberChoie,
      };
    });

    await createInvoiceItemsService(invoiceItems);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoicePending = async (req, res) => {
  try {
    const { userId } = req.query;
    const invoice = await getInvoicePendingService(userId);
    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }
    const invoiceItems = await getInvoiceItemsService(invoice._id);
    if (!invoiceItems) {
      res.status(404).json({ message: "Invoice items not found" });
      return;
    }

    const timeslot = await Promise.all(
      invoiceItems.map(async (item) => {
        const { timeslotId, dateChoiced, numberChoie } = item;
        const timeslot = await getTimeslotService(timeslotId);
        const { startTime, endTime, price, courtId } = timeslot;
        return {
          dateChoiced,
          numberChoie,
          startTime,
          endTime,
          price,
          courtId,
          timeslotId,
        };
      })
    );

    const court = await getCourtService(timeslot[0].courtId);
    if (!court) {
      res.status(404).json({ message: "Court not found" });
      return;
    }

    const response = {
      invoice,
      timeslot,
      court,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createInvoice, getInvoicePending };
