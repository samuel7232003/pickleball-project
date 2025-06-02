const express = require("express");
const {
  createUser,
  handleLogin,
  getProfile,
  getUser,
  editAccount,
  getUserById,
  getUsers,
  handleLogout,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const {
  createCourt,
  getCourt,
  searchCourt,
  getAllCourt,
  updateCourt,
} = require("../controllers/courtController");
const {
  createTimeslotCourt,
  getTimeslotCourt,
} = require("../controllers/timeslotController");
const { getImageCourt } = require("../controllers/imageCourtController");
const {
  createInvoice,
  getInvoicePending,
} = require("../controllers/invoiceController");

const routerAPI = express.Router();

module.exports = routerAPI;

routerAPI.get("/getCourt", getCourt);
routerAPI.get("/searchCourt", searchCourt);
routerAPI.get("/getAllCourt", getAllCourt);

routerAPI.get("/getImageCourt", getImageCourt);
routerAPI.get("/getTimeslot", getTimeslotCourt);

routerAPI.all("*", auth);

routerAPI.get("/profile", getProfile);
routerAPI.post("/signup", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/logout", handleLogout);

routerAPI.get("/getAccount", getUser);
routerAPI.post("/editAccount", editAccount);
routerAPI.post("/getUsersById", getUserById);
routerAPI.get("/getAllUser", getUsers);

routerAPI.post("/createCourt", createCourt);
routerAPI.put("/updateCourt/:courtId", updateCourt);

routerAPI.post("/createTimeslot", createTimeslotCourt);

routerAPI.post("/createInvoice", createInvoice);
routerAPI.get("/getInvoicePending", getInvoicePending);

module.exports = routerAPI;
