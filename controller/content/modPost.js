const { postModel } = require("../../models/Post");
const { Err } = require("../../utils/ErrorResponse");

const addView = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      res.sendStatus(404);
      return;
    }
    const currentViewCount = post.views;
    const newViewCount = currentViewCount + 1;
    post.views = newViewCount;
    await post.save();
    res.sendStatus(200);
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
