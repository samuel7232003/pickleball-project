const timeslotCourtModel = require("../models/TimeslotCourt");

const createTimeslotService = async (timeslot, courtId) => {
  try {
    const newTimeslot = await timeslotCourtModel.insertMany(
      timeslot.map((item) => ({ ...item, courtId }))
    );
    return newTimeslot;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getTimeslotService = async (id) => {
  try {
    const timeslot = await timeslotCourtModel.findOne({ _id: id });
    return timeslot;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getTimeslotsByCourtIdService = async (courtId) => {
  try {
    const timeslots = await timeslotCourtModel.find({ courtId: courtId });
    return timeslots;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createTimeslotService,
  getTimeslotService,
  getTimeslotsByCourtIdService,
};
