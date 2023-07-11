const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const jwt = require("jsonwebtoken");
const { Err } = require("../utils/ErrorResponse");
const { pool } = require("../config/db")

const authorize = async (req, res, next) => {
  const { userToken } = req.cookies;
  console.log("🍘 Present?", !!userToken);
  if (!userToken) {
    console.log("token not found,🍘", req.cookies);
    return res.send({ user: "Anonymous", invalid: true });
  }
  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    console.log("USER=", decoded.name);
    if (!decoded.id || !decoded.name)
      return Err(req, res, "JWT Tampered !!");

    const dbUser = await pool.query('SELECT username FROM users WHERE id = $1', [decoded.id]);
    if (!dbUser.rowCount || dbUser.rows[0].username !== decoded.name) {
      return Err(req, res, "Token tampered. User doesn't exist/match");
    }
    req.userId = decoded.id;
    req.userName = decoded.name;
    next();
  } catch (error) {
    return Err(req, res, error.message);
  }
};

module.exports = authorize;
