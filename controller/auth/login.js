const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const { userModel } = require("../../models/User");
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
    const extUser = await userModel.findOne({ email });
    console.log(extUser);
    if (!extUser) {
      return Err(req, res, "User not found. Try registering first.");
    }

    const isMatch = await bcrypt.compare(password, extUser.password);
    const token = jwt.sign(
      { id: extUser._id, name: extUser.username },
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
