const { postModel } = require("../../models/Post");
const { userModel } = require("../../models/User");
const { Err } = require("../../utils/ErrorResponse");

const fetchAll = async (req, res) => {
  console.log("FETCHING ALL");
  try {
    const postPool = await postModel.find().sort({ createdAt: "descending" });
    console.log(postPool.length);
    return res.send({
      status: "ok",
      message: "fetching all posts",
      posts: postPool,
    });
  } catch (error) {
    return Err(req, res, "Failed to fetch all posts\n" + error.message);
  }
};

const fetchSingle = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching one");
  try {
    const singlePost = await postModel.findById(id);
    console.log(singlePost.title);
    return res.send({
      status: "ok",
      message: "fetching single",
      post: singlePost,
    });
  } catch (error) {
    return Err(req, res, "Failed to fetch a post\n" + error.message);
  }
};

const getUserPosts = async (req, res) => {
  if (!req.userId || !req.userName) {
    return Err(req, res, "Missing user creds from req obj");
  }
  console.log(req.userId, req.userName);
  try {
    const extUserPosts = await userModel.findById(req.userId).populate("posts");
    console.log(extUserPosts.posts.length);
    let arr = extUserPosts.posts.reverse();
    return res.send({ status: "ok", posts: arr });
  } catch (error) {
    return Err(req, res, "Error in fetching user posts" + error.message);
  }
};

module.exports = { fetchAll, fetchSingle, getUserPosts };
