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
  // console.log(req.body.emptyPic, typeof req.body.emptyPic, !!req.file)
  const postId = req.params.id;
  const { title, summary, body, emptyPic } = req.body;
  let cover = "";
  console.log("UPDATING=", postId, !!title);

  // if (req.file) {
  //   cover = req.file.location;
  //   console.log("file updated=", cover);
  // }
  if (req.file) {
    console.log("file updated=", req.file.filename);
    const { filename } = req.file;
    if (filename) {
      cover = "/uploads/" + filename;
    }
  }
  if (emptyPic === "true") {
    cover = null;
  }
  console.log("cover=", cover);

  try {
    const post = await pool.query('UPDATE posts SET title = $1, summary = $2, body = $3, updated_at = $4 WHERE id = $5 RETURNING *;', [title, summary, body, new Date(), postId])
    if (!post.rowCount) {
      return Err(req, res, "POST UPDATION FAILED!!");
    }
    if (cover || cover == null) {
      const coverChange = await pool.query('UPDATE posts SET cover = $1 WHERE id = $2 RETURNING *;', [cover, postId])
      if (!coverChange.rowCount)
        return Err(req, res, "COVER PHOTO UPDATION FAILED!!");
    }
    console.log("UPDATED POST=", post.rows[0].id);
    return res.send({ status: "ok", message: "updated post", id: post.rows[0].id });
  } catch (err) {
    return Err(req, res, "Error while updating post" + err.message);
  }
};

module.exports = { addView, updPosts };
