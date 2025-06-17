const {
  getInvoiceItemsByTimeslotIdService,
  getInvoiceItemsService,
} = require("../services/invoiceItemService");
const { getInvoiceService } = require("../services/invoiceService");
const {
  createTimeslotService,
  getTimeslotsByCourtIdService,
  getTimeslotService,
} = require("../services/timeslotService");

const createTimeslotCourt = async (req, res) => {
  const { startTime, endTime, courtId, price } = req.body;
  const data = {
    startTime,
    endTime,
    courtId,
    price,
  };
  const response = await createTimeslotService(data);
  if (response) {
    return res.status(201).json(response);
  }
  return res.status(500).json({ message: "Error creating timeslot" });
};

const getTimeslotCourt = async (req, res) => {
  const { court_id, date, num } = req.query;
  const response = await getTimeslotsByCourtIdService(court_id);

  const timeslotStatus = [];

  for (let i = 0; i < response.length; i++) {
    let status = "AVAILABLE";
    const timeslot = response[i];
    const invoiceItems = await getInvoiceItemsByTimeslotIdService(timeslot._id, date, num);

    if (invoiceItems.length !== 0) {
      for (let j = 0; j < invoiceItems.length; j++) {
        const invoice = await getInvoiceService(invoiceItems[j].invoiceId);
        if (invoice.paymentStatus === "waiting") {
          status = "PENDING";
          break;
        } else if (invoice.paymentStatus === "pending") {
          status = "AVAILABLE";
          break;
        } else if (invoice.paymentStatus === "paid") {
          status = "UNAVAILABLE";
          break;
        }
      }
    }

    timeslotStatus.push({
      ...timeslot._doc,
      status,
    });
  }

  if (timeslotStatus.length > 0) {
    return res.status(200).json(timeslotStatus);
  }
  return res.status(404).json({ message: "Timeslot not found" });
};

module.exports = {
  createTimeslotCourt,
  getTimeslotCourt,
};
