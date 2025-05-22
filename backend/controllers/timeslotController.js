const { createTimeslotService, getTimeslotsByCourtIdService, getTimeslotService } = require("../services/timeslotService");

const createTimeslotCourt = async (req, res) => {
  const { start_time, end_time, court_id, price } = req.body;
  const response = await createTimeslotService(
    start_time,
    end_time,
    court_id,
    price,
  );
  if (response) {
    return res.status(201).json(response);
  }
  return res.status(500).json({ message: "Error creating timeslot" });
}

const getTimeslotCourt = async (req, res) => {
  const { id, court_id } = req.query;
  let response;
  if (id) response = await getTimeslotService(id);
  else if(court_id) response = await getTimeslotsByCourtIdService(court_id);

  if (response) {
    return res.status(200).json(response);
  }
  return res.status(404).json({ message: "Timeslot not found" });
}

module.exports = {
  createTimeslotCourt,
  getTimeslotCourt,
};