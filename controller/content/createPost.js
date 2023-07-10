const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const { postModel } = require("../../models/Post");
const { userModel } = require("../../models/User");
const jwt = require("jsonwebtoken");
const { Err } = require("../../utils/ErrorResponse");

const create = async (req, res) => {
  let cover = "";
  const { userToken } = req.cookies;
  const { title, summary, body } = req.body;
  if (!title || !summary || !body) {
    return Err(req, res, "Posts field missing!");
  }
  if (!userToken) {
    return Err(req, res, "Token missing! Can't find user");
  }

  const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
  try {
    if (!decoded.id) {
      return Err(req, res, "Token invalid. Missing id!");
    }
    const dbUser = await userModel
      .findOne({ _id: decoded.id })
      .select(["username"]);
    console.log("author:", decoded.name);

    if (!dbUser || dbUser.username !== decoded.name) {
      return Err(req, res, "Token tampered. User doesn't exist/match");
    }
    
    if (req.file) {
      const { filename } = req.file;
      if (filename) {
        cover = "/uploads/" + filename;
        console.log("cover", cover);
      }
    }

    const postObj = await postModel.create({
      title,
      summary,
      body,
      author: decoded.name,
      authorDetails: decoded.id,
      cover,
    });
    console.log("whole post:", postObj);
    if (postObj._id) {
      const updUser = await userModel.findOneAndUpdate(
        { _id: decoded.id },
        { $push: { posts: postObj._id } },
        { new: true }
      );
      console.log("post added to user", updUser);
    }
    return res.send({ status: "ok", message: "posted", id: postObj._id });
  } catch (error) {
    return Err(req, res, error.message);
  }

  res.end();
};
module.exports = create;
