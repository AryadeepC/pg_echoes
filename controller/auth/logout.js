const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const { redisClient } = require("../../config/db");
const jwt = require("jsonwebtoken");

const logoutController = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log("🍘 Present?", !!accessToken, !!refreshToken);

  if (!accessToken && !refreshToken) {
    console.log("token not found,🍘", req.cookies);
    return res.send({ status: "ok", message: "user logged out" });
  }

  try {
    const token = accessToken ? accessToken : refreshToken;
    const sec = accessToken ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
    const { id, name } = jwt.verify(token, sec);
    await redisClient.del(id);
  } catch (error) {
    console.error(error);
  }
  res.cookie("accessToken", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  console.log("🍘:", req.cookies);
  res.send({ status: "ok", message: "user logged out" });
};

module.exports = { logoutController };
