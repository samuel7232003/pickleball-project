const { getImageCourtService } = require("../services/imageCourtService");

const getImageCourt = async (req, res) => {
  const { courtId } = req.query;
  const response = await getImageCourtService(courtId);
  return res.status(200).json(response);
};

module.exports = {
  getImageCourt,
};