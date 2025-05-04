const express = require('express');
const { createUser, handleLogin, getProfile, getUser, editAccount, getUserById, getUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');

const routerAPI = express.Router();

module.exports = routerAPI;

routerAPI.all("*", auth);

routerAPI.post("/signup", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/profile", getProfile);
routerAPI.get("/account", getUser);
routerAPI.post("/editAccount", editAccount);
routerAPI.post("/getUsersById", getUserById);
routerAPI.get("/getAllUser", getUsers);

module.exports = routerAPI;