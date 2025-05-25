const {
  createAccountService,
  loginService,
  getUserService,
  editAccountService,
  getUsersService,
} = require("../services/accountService");

const createUser = async (req, res) => {
  const { username, password, first_name, last_name, role } = req.body;
  const data = await createAccountService(
    username,
    password,
    first_name,
    last_name,
    role
  );
  if(data.EC === 0){
    return await handleLogin(req, res);
  }
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);
  if(data.EC === 0){
    const {access_token} = data;
    res.cookie("token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({EC: 0});
  }
  return res.status(200).json(data);
}

const handleLogout = async(req, res) => {
  res.clearCookie("token");
  return res.status(200).json({message: "Logout success!"})
}

const getProfile = async (req, res) => {
  const { username } = req.user;
  const response = await getUserService(null, username);
  if(response) return res.status(200).json(response);
  else return res.status(404);
};

const getUser = async (req, res) => {
  const { id, username } = req.query;
  const data = await getUserService(id, username);
  return res.status(200).json(data);
};

const editAccount = async (req, res) => {
  const newAcc = req.body;
  const data = await editAccountService(newAcc);

  return res.status(200).json(data);
};

const getUserById = async (req, res) => {
  const listId = req.body;
  const data = await getUserByIdService(listId);
  return res.status(200).json(data);
};

const getUsers = async (req, res) => {
  const data = await getUsersService();
  return res.status(200).json(data);
};

module.exports = {
  createUser,
  handleLogin,
  handleLogout,
  getProfile,
  getUser,
  editAccount,
  getUserById,
  getUsers,
};
