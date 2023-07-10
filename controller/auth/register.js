const { pool } = require("../../config/db");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Err } = require("../../utils/ErrorResponse");

const register = async (req, res) => {
  console.log(req.body);
  const { username = "", email = "", password = "" } = req.body;

  if (!username || !email || !password) {
    return Err(req, res, "Invalid credentials");
  }

  const hashedpassword = await bcrypt.hash(password, 8);
  const user = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]).rows;
  // console.log("found user:",user);

  if (user) {
    return Err(req, res, "Email already exists");
  }

  try {
    const result = await pool.query('INSERT INTO users (id,username,email,password) VALUES ($1,$2,$3,$4) RETURNING *', [crypto.randomUUID(), username, email, hashedpassword]);
    // let result = await author.save();
    console.log(result.rows[0]);
    // delete result["password"];
    console.log("REGISTRATION SUCCESSFUL ✅")

    return res.status(201).send({
      status: "ok",
      message: "User registered successfully",
      user: result.rows[0].username,
    });
  } catch (error) {
    return Err(req, res, error.message);
  }
};
module.exports = register;
