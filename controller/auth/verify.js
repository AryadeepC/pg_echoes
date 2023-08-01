const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const jwt = require("jsonwebtoken");
const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");

const veriftJwt = async (req, res) => {
  const { userToken } = req.cookies;
  console.log("🍘 Present?", !!userToken);
  if (!userToken) return res.send({ user: "Anonymous", invalid: true });

  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
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
