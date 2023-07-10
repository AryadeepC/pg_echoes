const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const jwt = require("jsonwebtoken");
const { userModel } = require("../../models/User");

const veriftJwt = async (req, res) => {
  const { userToken } = req.cookies;
  console.log("User🍘Present?", !!userToken);
  if (!userToken) return res.send({ user: "Anonymous", invalid: true });

  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    console.log("decoded stuff", decoded);

    if (decoded.id) {
      const extUser = await userModel
        .findOne({ _id: decoded.id })
        .select(["_id", "username"]);

      console.log("name from db:", extUser.username);
      if (!extUser) {
        return Err(req, res, "User not found in db while verifying");
      }

      return res.send({
        status: "ok",
        message: "User verified",
        username: extUser.username,
        userid: extUser._id,
      });
    }
    return Err(req, res, "Invalid/tampered user token");
  } catch (error) {
    return Err(req, res, error.message);
  }
};

module.exports = veriftJwt;
