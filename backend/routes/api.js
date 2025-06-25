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
  getOwners,
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
  getTimeslotByCourtId,
} = require("../controllers/timeslotController");
const { getImageCourt } = require("../controllers/imageCourtController");
const {
  createInvoice,
  getInvoicePending,
  updateInvoice,
  checkInvoiceStatus,
  getInvoiceByIdUser,
  cancelInvoice,
} = require("../controllers/invoiceController");
const {
  createPaymaentUrl,
  onStatusPayment,
} = require("../controllers/payosController");
const { getStatistics } = require("../controllers/statisticsController");
const { getCalendarEvents } = require("../controllers/calendarController");
const {
  createPost,
  getPosts,
  getPost,
} = require("../controllers/postController");
const {
  createRequest,
  getRequests,
  updateRequest,
} = require("../controllers/requestController");

const routerAPI = express.Router();

module.exports = routerAPI;

routerAPI.get("/getCourt", getCourt);
routerAPI.get("/searchCourt", searchCourt);
routerAPI.get("/getAllCourt", getAllCourt);

routerAPI.get("/getImageCourt", getImageCourt);
routerAPI.get("/getTimeslot", getTimeslotCourt);

routerAPI.post("/create-embedded-payment-link", createPaymaentUrl);
routerAPI.post("/payment-status", onStatusPayment);

routerAPI.get("/getPosts", getPosts);
routerAPI.get("/getPost", getPost);

routerAPI.all("*", auth);

routerAPI.get("/profile", getProfile);
routerAPI.post("/signup", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/logout", handleLogout);

routerAPI.get("/getAccount", getUser);
routerAPI.post("/editAccount", editAccount);
routerAPI.post("/getUsersById", getUserById);
routerAPI.get("/getAllUser", getUsers);
routerAPI.get("/getAllOwner", getOwners);

routerAPI.post("/createCourt", createCourt);
routerAPI.put("/updateCourt/:courtId", updateCourt);
routerAPI.get("/getListCourt", getCourt);

routerAPI.post("/createTimeslot", createTimeslotCourt);
routerAPI.get("/getTimeslotByCourtId", getTimeslotByCourtId);

routerAPI.post("/createInvoice", createInvoice);
routerAPI.get("/getInvoicePending", getInvoicePending);
routerAPI.post("/updateInvoice", updateInvoice);
routerAPI.post("/checkInvoiceStatus", checkInvoiceStatus);
routerAPI.get("/getInvoiceByIdUser", getInvoiceByIdUser);
routerAPI.get("/cancelInvoice", cancelInvoice);

// Statistics routes
routerAPI.get("/manage/statistics", getStatistics);
routerAPI.get("/manage/events", getCalendarEvents);

// Post routes
routerAPI.post("/createPost", createPost);

// Request routes
routerAPI.post("/createRequest", createRequest);
routerAPI.get("/getRequests", getRequests);
routerAPI.put("/updateRequest/:requestId", updateRequest);

module.exports = routerAPI;
