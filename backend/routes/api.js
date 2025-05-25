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
const { createCourt, getCourt, searchCourt, getAllCourt } = require("../controllers/courtController");
const {
  createTimeslotCourt,
  getTimeslotCourt,
} = require("../controllers/timeslotController");
const { getImageCourt } = require("../controllers/imageCourtController");
const { createInvoice, getInvoicePending } = require("../controllers/invoiceController");

const routerAPI = express.Router();

module.exports = routerAPI;

routerAPI.all("*", auth);
routerAPI.get("/profile", getProfile);
routerAPI.post("/signup", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/logout", handleLogout);

routerAPI.get("/account", getUser);
routerAPI.post("/editAccount", editAccount);
routerAPI.post("/getUsersById", getUserById);
routerAPI.get("/getAllUser", getUsers);

routerAPI.post("/createCourt", createCourt);
routerAPI.get("/getCourt", getCourt);
routerAPI.get("/searchCourt", searchCourt);
routerAPI.get("/getAllCourt", getAllCourt);

routerAPI.post("/createTimeslot", createTimeslotCourt);
routerAPI.get("/getTimeslot", getTimeslotCourt);

routerAPI.get("/getImageCourt", getImageCourt);

routerAPI.post("/createInvoice", createInvoice);
routerAPI.get("/getInvoicePending", getInvoicePending);

module.exports = routerAPI;
