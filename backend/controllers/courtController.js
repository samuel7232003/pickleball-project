const {
  createCourtService,
  getCourtService,
  getAllCourtsService,
  getCourtsByOwnerIdService,
  searchCourtsService,
} = require("../services/courtService");
const { createImageCourtService, getImageCourtService } = require("../services/imageCourtService");
const { createTimeslotService, getTimeslotsByCourtIdService } = require("../services/timeslotService");

const createCourt = async (req, res) => {
  const { name, lat, lng, location, description, ownerId, number, images , listTimeslot} = req.body;
  const data = {name, lat, lng, location, description, ownerId, number};
  const response = await createCourtService(data);
  const courtId = response._id;
  const responseTimeslot = await createTimeslotService(listTimeslot, courtId);
  const responseImage = await createImageCourtService(images, courtId);
  if (response && responseTimeslot && responseImage) {
    return res.status(201).json(response);
  }
  return res.status(500).json({ message: "Error creating court" });
};

const getCourt = async (req, res) => {
  const { _id, ownerId } = req.query;
  let response;
  if (_id) {
    response = await getCourtService(_id);
    const timeslot = await getTimeslotsByCourtIdService(response._id);
    response.timeslot = timeslot;
    const images = await getImageCourtService(response._id);
    response = { ...response, timeslot, images };
  }
  else if (ownerId) response = await getCourtsByOwnerIdService(ownerId);
  else response = await getAllCourtsService();

  if (response) {
    return res.status(200).json(response);
  }
  return res.status(404).json({ message: "Court not found" });
};

const searchCourt = async (req, res) => {
  const { text } = req.query;
  const response = await searchCourtsService(text);
  return res.status(200).json(response);
};

const getAllCourt = async (req, res) => {
  const response = await getAllCourtService();
  return res.status(200).json(response);
};

module.exports = {
  createCourt,
  getCourt,
  searchCourt,
  getAllCourt,
};
