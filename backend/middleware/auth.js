require("dotenv");
const { jwtVerify } = require("jose");

const auth = async (req, res, next) => {
  const white_lists = ["/", "/login", "/signup"];

  const url = req.originalUrl.split("?")[0]; 
  if (white_lists.includes(url)) {
    return next();
  }

  const token =
    req?.cookies?.token ||
    req?.headers?.authorization?.split(" ")?.[1] ||
    req?.query?.token;

  if (!token) {
    return res.status(401).json({
      message: "Bạn chưa đăng nhập hoặc token đã hết hạn!",
    });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    req.user = {
      username: payload.username,
      first_name: payload.first_name,
      avatar: payload.avatar,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn!",
    });
  }
};

module.exports = auth;
