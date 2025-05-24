const courtModel = require("../models/Court");

const createCourtService = async (data) => {

  try {
    const newCourt = new courtModel(data);
    const result = await newCourt.save();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCourtService = async (id) => {
  try {
    const court = await courtModel.findById(id);
    return court;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCourtsByOwnerIdService = async (ownerId) => {
  try {
    const courts = await courtModel.find({ owner_id: ownerId });
    return courts;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllCourtsService = async () => {
  try {
    const courts = await courtModel.find();
    return courts;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateCourtService = async (courtId, updatedData) => {
  try {
    const result = await courtModel.find(courtId);
    if (result) {
      const updatedCourt = await courtModel.findByIdAndUpdate(
        courtId,
        updatedData,
        { new: true }
      );
      return updatedCourt;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteCourtService = async (courtId) => {
  try {
    const result = await courtModel.findByIdAndDelete(courtId);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createCourtService,
  getCourtService,
  getCourtsByOwnerIdService,
  getAllCourtsService,
  updateCourtService,
  deleteCourtService,
};
