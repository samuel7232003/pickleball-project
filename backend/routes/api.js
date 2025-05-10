const express = require('express');
const { createUser, handleLogin, getProfile, getUser, editAccount, getUserById, getUsers, handleLogout } = require('../controllers/userController');
const auth = require('../middleware/auth');

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

module.exports = routerAPI;