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

const getCourtService = async (_id) => {
  try {
    const court = await courtModel.findOne({_id});
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

const searchCourtsService = async (text) => {
  try {
    const keyword = text.trim();

    if (!keyword || keyword.length < 1) {
      return []; // Không tìm nếu không có ký tự đáng kể
    }

    const courts = await courtModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } }
      ]
    });

    return courts;
  } catch (error) {
    console.log("Search error:", error);
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
  searchCourtsService,
};
