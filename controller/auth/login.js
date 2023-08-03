const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");
const { Err } = require("../../utils/ErrorResponse");
const { signAccessToken, signRefreshToken } = require("../../utils/token");

const login = async (req, res) => {
  console.log(req.body);
  // console.log("🍘", req.cookies);

  const { email = "", password = "" } = req.body;
  if (!email || !password) {
    return Err(req, res, "Bad request");
  }

  try {
    let userInDb = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
    console.log("user in db:", userInDb.rows[0].username);
    if (!userInDb.rowCount) {
      return Err(req, res, "User not found. Try registering first.");
    }
    userInDb = userInDb.rows[0];

    const isMatch = await bcrypt.compare(password, userInDb.password);
    if (!isMatch) {
      return Err(req, res, "Credentials mismatch");
    }

    const payload = { id: userInDb.id, name: userInDb.username }
    const accessToken = signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    console.log("LOGIN SUCCESSFUL ✅");

    return res.send({
      status: "ok",
      message: "Login successful",
      username: userInDb.username,
    });
  } catch (error) {
    return Err(req, res, error.message);
  }
};

module.exports = login;
