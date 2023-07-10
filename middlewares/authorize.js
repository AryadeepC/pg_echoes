const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const jwt = require("jsonwebtoken");
const { Err } = require("../utils/ErrorResponse");

const authorize = (req, res, next) => {
  const { userToken } = req.cookies;
  console.log("🍘 Present?", !!userToken);
  if (!userToken) {
    console.log("token not found,🍘", req.cookies);
    return res.send({ user: "Anonymous", invalid: true });
  }
  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    console.log("decoded stuff", decoded);
    req.userId = decoded.id;
    req.userName = decoded.name;
    next();
  } catch (error) {
    return Err(req, res, error.message);
  }
};

module.exports = authorize;
