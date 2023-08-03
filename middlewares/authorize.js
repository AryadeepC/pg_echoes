const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const jwt = require("jsonwebtoken");
const { Err } = require("../utils/ErrorResponse");
const { pool } = require("../config/db");

const authorize = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log("🍘 Present?", !!accessToken, !!refreshToken);
  console.log(req.cookies);
  
  if (!accessToken && !refreshToken) {
    console.log("token not found,🍘", req.cookies);
    return res.send({ user: "Anonymous", invalid: true });
  }

  try {
    if (!accessToken) {
      const { id, name } = await regenTokens(req, res, refreshToken);
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
