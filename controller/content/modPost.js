const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");

const addView = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [postId])
    if (!post.rowCount) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
    res.end();
  } catch (err) {
    console.error("error while adding view", err);
    res.sendStatus(500);
  }
};

const updPosts = async (req, res) => {
  const postId = req.params.id;
  const { title, summary, body, emptyPic } = req.body;
  let cover = "";

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return Err(req, res, "Post not found in update");
    }

    if (req.file) {
      console.log("file in update", req.file.filename);
      const { filename } = req.file;
      if (filename) {
        cover = "/uploads/" + filename;
        console.log("cover", cover);
      }
    }

    post.title = title;
    post.summary = summary;
    post.body = body;
    if (req.file) {
      post.cover = cover;
    }

    if (emptyPic === "true") {
      post.cover = "";
    }

    const neoPost = await post.save();
    console.log(neoPost);
    return res.send({ status: "ok", message: "updated post", id: post._id });
  } catch (err) {
    return Err(req, res, "Error while updating post" + err.message);
  }
};

module.exports = { addView, updPosts };
