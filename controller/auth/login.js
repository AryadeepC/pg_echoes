const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Err } = require("../../utils/ErrorResponse");

const login = async (req, res) => {
  const { email = "", password = "" } = req.body;
  console.log(req.body);
  console.log("🍘", req.cookies);

  if (!email || !password) {
    return Err(req, res, "Bad request");
  }

  try {
    let extUser = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
    console.log("user in db:", extUser.rows[0].username);
    if (!extUser.rowCount) {
      return Err(req, res, "User not found. Try registering first.");
    }
    extUser = extUser.rows[0];

    const isMatch = await bcrypt.compare(password, extUser.password);
    const token = jwt.sign(
      { id: extUser.id, name: extUser.username },
      process.env.JWT_SECRET
    );

    if (!isMatch) {
      return Err(req, res, "Credentials mismatch");
    }

    res.cookie("userToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    console.log("LOGIN SUCCESSFUL ✅");

    return res.send({
      status: "ok",
      message: "Login successful",
      username: extUser.username,
    });
  } catch (error) {
    return Err(req, res, error.message);
  }
};

module.exports = login;
