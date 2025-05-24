const {
  createCourtService,
  getCourtService,
  getAllCourtsService,
  getCourtsByOwnerIdService,
} = require("../services/courtService");
const { createImageCourtService } = require("../services/imageCourtService");
const { createTimeslotService } = require("../services/timeslotService");

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
  const { id, ownerId } = req.query;
  let response;
  if (id) response = await getCourtService(id);
  else if (ownerId) response = await getCourtsByOwnerIdService(ownerId);
  else response = await getAllCourtsService();

  if (response) {
    return res.status(200).json(response);
  }
  return res.status(404).json({ message: "Court not found" });
};

module.exports = {
  createCourt,
  getCourt,
};
