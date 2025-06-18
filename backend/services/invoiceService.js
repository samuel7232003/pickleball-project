const invoiceModel = require("../models/Invoice");

const createInvoiceService = async (invoice) => {
  const newInvoice = await invoiceModel.create(invoice);
  return newInvoice;
};

const getInvoicePendingService = async (userId) => {
  const invoice = await invoiceModel
    .findOne({ userId, paymentStatus: { $in: ["pending", "waiting"] } })
    .sort({ createdAt: -1 });
  return invoice;
};

const getInvoiceService = async (invoiceId) => {
  const invoice = await invoiceModel.findOne({ _id: invoiceId });
  return invoice;
};

const setDoneInvoiceService = async (orderCode) => {
  try {
    const responce = await invoiceModel.updateOne(
      { orderCode: orderCode },
      { $set: { paymentStatus: "paid" } }
    );
    return responce;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateInvoiceService = async (invoiceId, status) => {
  let invoice;
  if (status === "waiting") {
    invoice = await invoiceModel.updateOne(
      { _id: invoiceId },
      { $set: { paymentStatus: status, timeStartWaiting: new Date() } }
    );
  } else {
    invoice = await invoiceModel.updateOne(
      { _id: invoiceId },
      { $set: { paymentStatus: status } }
    );
  }
  return invoice;
};

const updateOrderCodeToInvoiceService = async (orderCode, invoiceId) => {
  const invoice = await invoiceModel.updateOne(
    { _id: invoiceId },
    { $set: { orderCode: orderCode } }
  );
  return invoice;
};

const checkInvoiceStatusService = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    // 1. Tìm invoice "waiting" quá 5 phút => chuyển sang "pending"
    const invoicesToPending = await invoiceModel.find({
      paymentStatus: "waiting",
      timeStartWaiting: { $lt: fiveMinutesAgo },
    });

    const updatePendingPromises = invoicesToPending.map(async (invoice) =>{
      await updateInvoiceService(invoice._id, "pending");
      await updateOrderCodeToInvoiceService("", invoice._id);
    });

    // 2. Tìm các invoice tạo hơn 1 ngày và status chưa expired => chuyển sang "expired"
    const invoicesToExpire = await invoiceModel.find({
      paymentStatus: { $in: ["waiting", "pending"] },
      createdAt: { $lt: oneDayAgo },
    });

    const updateExpiredPromises = invoicesToExpire.map((invoice) =>
      updateInvoiceService(invoice._id, "expired")
    );

    // Thực hiện đồng thời
    await Promise.all([...updatePendingPromises, ...updateExpiredPromises]);

    return {
      success: true,
      updatedToPending: invoicesToPending.length,
      updatedToExpired: invoicesToExpire.length,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
};


const getInvoiceByIdUserService = async (userId, role) => {
  if(role === "USER") { 
    const invoice = await invoiceModel.find({ userId }).sort({ createdAt: -1 });
    return invoice;
  } else {
    const invoice = await invoiceModel.find({ ownerId: userId, paymentStatus: 'paid' }).sort({ createdAt: -1 });
    return invoice;
  }
};

const cancelInvoiceService = async (invoiceId) => {
  const invoice = await invoiceModel.deleteOne({ _id: invoiceId });
  return invoice;
};

module.exports = {
  createInvoiceService,
  getInvoicePendingService,
  getInvoiceService,
  setDoneInvoiceService,
  updateInvoiceService,
  checkInvoiceStatusService,
  getInvoiceByIdUserService,
  updateOrderCodeToInvoiceService,
  cancelInvoiceService,
};
