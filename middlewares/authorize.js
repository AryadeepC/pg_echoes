const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const jwt = require("jsonwebtoken");
const { Err } = require("../utils/ErrorResponse");
const { pool, redisClient } = require("../config/db");

const authorize = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log("🍘 Present?", !!accessToken, !!refreshToken);
  console.log(req.cookies);

  if (!accessToken && !refreshToken) {
    console.log("token not found,🍘", req.cookies);
    return res.status(401).send({ user: "Anonymous", invalid: true });
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

      req.userId = id
      req.userName = name
      next();
    }
    const decodedAccessPayload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    // console.log("USER=", decodedAccessPayload.name);
    if (!decodedAccessPayload.id || !decodedAccessPayload.name)
      return Err(req, res, "invalid token");

    const dbUser = await pool.query('SELECT username FROM users WHERE id = $1', [decodedAccessPayload.id]);
    if (!dbUser.rowCount || dbUser.rows[0].username !== decodedAccessPayload.name) {
      return Err(req, res, "invalid token");
    }

    req.userId = decodedAccessPayload.id;
    req.userName = decodedAccessPayload.name;
    next();
  } catch (error) {
    const er_msg = error.name === "JsonWebTokenError" ? "Internal Server Error" : error.message;
    return Err(req, res, er_msg);
  }
};

module.exports = authorize;
