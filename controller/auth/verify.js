const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const jwt = require("jsonwebtoken");
const { pool, redisClient } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");
const { regenTokens } = require("../../utils/token");

const veriftJwt = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log("🍘 Present?", !!accessToken, !!refreshToken);

  if (!accessToken && !refreshToken) {
    console.log("token not found,🍘", req.cookies);
    return res.send({ user: "Anonymous", invalid: true });
  }

  try {
    if (!accessToken) {
      const { id, name, at, rt } = await regenTokens(req, res, refreshToken);
      const cacheToken = await redisClient.get(id);
      if (refreshToken !== cacheToken) {
        return Err(req, res, "Unauthorized token", 401)
      }

      res.cookie("accessToken", at, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", rt, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.send({
        status: "ok",
        message: "User verified",
        username: name,
        userid: id,
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    console.log("USER=", decoded.name);

    if (decoded.id) {
      let extUser = await pool.query('SELECT id, username FROM users WHERE id = $1;', [decoded.id])
      extUser = extUser.rows[0];
      console.log("name from db:", extUser.username);

      if (!extUser) {
        return Err(req, res, "User not found in db while verifying");
      }

      return res.send({
        status: "ok",
        message: "User verified",
        username: extUser.username,
        userid: extUser.id,
      });
    }
    return Err(req, res, "Invalid/tampered user token");
  } catch (error) {
    const er_msg = error.name === "JsonWebTokenError" ? "Internal Server Error" : error.message;
    return Err(req, res, er_msg);
  }
};

module.exports = veriftJwt;
