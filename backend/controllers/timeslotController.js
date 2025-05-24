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
  const { id, court_id } = req.query;
  let response;
  if (id) response = await getTimeslotService(id);
  else if (court_id) response = await getTimeslotsByCourtIdService(court_id);

  if (response) {
    return res.status(200).json(response);
  }
  return res.status(404).json({ message: "Timeslot not found" });
};

module.exports = {
  createTimeslotCourt,
  getTimeslotCourt,
};
