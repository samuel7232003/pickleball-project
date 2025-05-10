const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const white_lists = ["/", "/login", "/signup"];

  if (white_lists.includes(req.originalUrl)) {
    return next();
  }

  const token =
    req?.cookies?.token || // Lấy token từ cookie (tên cookie là 'token')
    req?.headers?.authorization?.split(" ")?.[1]; // fallback: từ Authorization header

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        username: decoded.username,
        first_name: decoded.first_name,
        avatar: decoded.avatar,
      };
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc đã hết hạn!",
      });
    }
  } else {
    return res.status(401).json({
      message: "Bạn chưa đăng nhập hoặc token đã hết hạn!",
    });
  }
};

module.exports = auth;
