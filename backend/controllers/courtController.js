const {
  createCourtService,
  getCourtService,
  getAllCourtsService,
  getCourtsByOwnerIdService,
} = require("../services/courtService");

const createCourt = async (req, res) => {
  const { name, lat, lng, address, description, owner_id } = req.body;
  const response = await createCourtService(
    name,
    lat,
    lng,
    address,
    description,
    owner_id
  );
  if (response) {
    return res.status(201).json(response);
  }
  return res.status(500).json({ message: "Error creating court" });
};

const getCourt = async (req, res) => {
  const { id, owner_id } = req.query;
  let response;
  if (id) response = await getCourtService(id);
  else if (owner_id) response = await getCourtsByOwnerIdService(owner_id);
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
