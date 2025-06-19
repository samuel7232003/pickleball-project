const Request = require("../models/Request");

const STATUS = {
  PENDING: "PENDING",
  APPROVE: "APPROVE",
  DENINE: "DENINE",
};

const createRequestService = async (data) => {
  const request = new Request({ ...data, status: STATUS.PENDING });
  return await request.save();
};

const getRequestService = async (filter = {}) => {
  return await Request.find(filter).sort({ createdAt: -1 });
};

const updateRequestService = async (requestId, updateData) => {
  updateData.updatedAt = new Date();
  return await Request.findByIdAndUpdate(requestId, updateData, { new: true });
};

module.exports = {
  STATUS,
  createRequestService,
  getRequestService,
  updateRequestService,
};
