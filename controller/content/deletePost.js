const path = require("path");
const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");
const fs = require("fs");

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const neededPost = await postModel.findById(postId);
    if (!neededPost) {
      return Err(req, res, "Post does not exist");
    }
    console.log(neededPost.author, neededPost.author_id);
    const postAuthor = await userModel.findById(neededPost.authorDetails);
    if (!postAuthor) {
      return Err(req, res, "User not found while deleting post");
    }
    const oldSize = postAuthor.posts.length;
    console.log("oldSize", oldSize);
    postAuthor.posts = postAuthor.posts.filter((post) => {
      return String(post) !== String(postId);
    });

    if (postAuthor.posts.length < oldSize) {
      console.log("Removed from user posts list");
    } else {
      return Err(req, res, "Error while removing post from list");
    }
    await postAuthor.save();
    let filePath = path.join(__dirname, "../../public", neededPost.cover);
    console.log("img path=", filePath);

    fs.unlink(filePath, (err) => {
      if (err) console.error(err.message);
      else console.log("Image deleted @", filePath);
    });

    const deletedPost = await postModel.findByIdAndDelete(postId);
    console.log("DELETED=", deletedPost);

    return res.send({
      status: "ok",
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (err) {
    return Err(req, res, err.message);
  }
};
module.exports = { deletePost };
