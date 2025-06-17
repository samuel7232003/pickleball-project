const { getCourtService } = require("../services/courtService");
const {
  createInvoiceItemsService,
  getInvoiceItemsService,
  cancelInvoiceItemService,
} = require("../services/invoiceItemService");
const {
  createInvoiceService,
  getInvoicePendingService,
  updateInvoiceService,
  checkInvoiceStatusService,
  getInvoiceByIdUserService,
  getInvoiceService,
  cancelInvoiceService,
} = require("../services/invoiceService");
const { getTimeslotService } = require("../services/timeslotService");
const invoiceModel = require("../models/Invoice");

const createInvoice = async (req, res) => {
  try {
    const { userId, ownerId, timeChoice, orderCode, amount, courtId } = req.body;
    const newInvoice = await createInvoiceService({
      userId,
      ownerId,
      orderCode,
      amount,
      courtId,
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
    const { userId, invoiceId } = req.query;
    let invoice;
    if (invoiceId !== "") {
      invoice = await getInvoiceService(invoiceId);
    } else {
      invoice = await getInvoicePendingService(userId);
    }
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

const updateInvoice = async (req, res) => {
  const { invoiceId, status } = req.body;
  const invoice = await updateInvoiceService(invoiceId, status);
  res.status(200).json(invoice);
};

const checkInvoiceStatus = async (req, res) => {
  try {
    const result = await checkInvoiceStatusService();

    if (result.success) {
      res.status(200).json({
        message: "Invoice status check completed",
        updatedCount: result.updatedCount,
      });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceByIdUser = async (req, res) => {
  const { userId, role } = req.query;
  const invoice = await getInvoiceByIdUserService(userId, role);
  res.status(200).json(invoice);
};

const cancelInvoice = async (req, res) => {
  const { invoiceId } = req.query;
  const invoice = await cancelInvoiceService(invoiceId);
  const invoiceItems = await cancelInvoiceItemService(invoiceId);
  res.status(200).json(invoice);
};

module.exports = {
  createInvoice,
  getInvoicePending,
  updateInvoice,
  checkInvoiceStatus,
  getInvoiceByIdUser,
  cancelInvoice,
};
