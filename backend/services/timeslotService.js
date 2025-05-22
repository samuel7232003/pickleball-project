const timeslotCourtModel = require("../models/TimeslotCourt");

const createTimeslotService = async (timeslot) => {
  try {
    const newTimeslot = await timeslotCourtModel.create(timeslot);
    return newTimeslot;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getTimeslotService = async (id) => {
  try {
    const timeslot = await timeslotCourtModel.findById(id);
    return timeslot;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getTimeslotsByCourtIdService = async (courtId) => {
  try {
    const timeslots = await timeslotCourtModel.find({ court_id: courtId });
    return timeslots;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createTimeslotService,
  getTimeslotService,
  getTimeslotsByCourtIdService,
};