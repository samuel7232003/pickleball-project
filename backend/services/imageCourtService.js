const imageCourtModel = require("../models/ImageCourt");

const createImageCourtService = async (images, courtId) => {
  const newImage = await imageCourtModel.insertMany(
    images.map((item) => ({ ...item, courtId }))
  );
  return newImage;
};

const getImageCourtService = async(courtId) => {
  const image = await imageCourtModel.find({ courtId: courtId });
  return image;
};

module.exports = {
  createImageCourtService,
  getImageCourtService,
};
