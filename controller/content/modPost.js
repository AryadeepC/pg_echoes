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
  console.log("UPDATING=", postId, !!title);
  
  if (req.file) {
    console.log("file updated=", req.file.filename);
    const { filename } = req.file;
    if (filename) {
      cover = "/uploads/" + filename;
      console.log("cover=", cover);
    }
  }
  if (emptyPic === "true") {
    cover = "";
  }

  try {
    const post = await pool.query('UPDATE posts SET title = $1, summary = $2, body = $3, cover = $4, updated_at = $5 WHERE id = $6 RETURNING *;', [title, summary, body, cover, new Date(), postId])
    if (!post.rowCount) {
      return Err(req, res, "POST UPDATION FAILED!!");
    }
    console.log("UPDATED POST=", post.rows[0]);
    return res.send({ status: "ok", message: "updated post", id: post.rows[0].id });
  } catch (err) {
    return Err(req, res, "Error while updating post" + err.message);
  }
};

module.exports = { addView, updPosts };
