const { userModel } = require("../../models/User");
const bcrypt = require("bcryptjs");
const { Err } = require("../../utils/ErrorResponse");

const register = async (req, res) => {
  console.log(req.body);
  const { username = "", email = "", password = "" } = req.body;

  if (!username || !email || !password) {
    return Err(req, res, "Invalid credentials");
  }

  const hashedpassword = await bcrypt.hash(password, 8);
  const user = await userModel.findOne({ email });

  if (user) {
    return Err(req, res, "Email already exists");
  }

  try {
    const author = new userModel({ username, email, password: hashedpassword });
    let result = await author.save();
    delete result["password"];
    console.log("REGISTRATION SUCCESSFUL ✅")
    
    return res.status(201).send({
      status: "ok",
      message: "User registered successfully",
      user: result.username,
    });
  } catch (error) {
    return Err(req, res, error.message);
  }
};
module.exports = register;
