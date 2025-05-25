const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { SignJWT } = require("jose");
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const bcrypt = require("bcrypt");
const accountModel = require("../models/Account");
const { ERROR_LOGIN_CODE } = require('../common/constant');
const saltRounds = 10;

const createAccountService = async (username, password, first_name, last_name) => {
  try {
    const user = await accountModel.findOne({ username });
    if (user) {
      return {EC: 1};
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await accountModel.create({
      username: username,
      password: hashPassword,
      first_name: first_name,
      last_name: last_name,
    });
    return {EC: 0};
  } catch (error) {
    console.log(error);
    return {EC: 1};
  }
};

const loginService = async (username, password) => {
  try {
    const user = await accountModel.findOne({ username: username });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: ERROR_LOGIN_CODE,
        };
      } else {
        const payload = {
          username: user.username,
          first_name: user.first_name,
          avatar: user.avatar,
        };

        const jwtConstructor = new SignJWT(payload);
        const access_token = await jwtConstructor
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(process.env.JWT_EXPIRE || "1h")
          .sign(secret);

        return {
          EC: 0,
          access_token,
          user: user
        };
      }
    } else {
      return {
        EC: 1,
        EM: ERROR_LOGIN_CODE,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async (id, username) => {
  try {
    let query = {};
    if (id) query._id = id;
    if (username) query.username = username;

    const user = await accountModel.findOne(query);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const editAccountService = async (newAcc) => {
  try {
    const response = await accountModel.replaceOne(
      { _id: newAcc._id },
      {
        first_name: newAcc.first_name,
        last_name: newAcc.last_name,
        email: newAcc.email,
        password: newAcc.password,
        role: newAcc.role,
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};

const getUsersByIdService = async (listId) => {
  try {
    const uniUsers = [...new Set(listId)];
    const result = await accountModel.find({ _id: { $in: uniUsers } });
    return result;
  } catch (error) {
    return null;
  }
};

const getUsersService = async () => {
  try {
    const response = await accountModel.find({ role: "user" });
    return response;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createAccountService,
  loginService,
  getUserService,
  editAccountService,
  getUsersByIdService,
  getUsersService,
};
