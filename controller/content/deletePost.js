const path = require("path");
const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");
const fs = require("fs");
// const firebase = require("firebase");
const { ref, getStorage, refFromURL, delete: delFile } = require("firebase/storage")


const deletePost = async (req, res) => {
  // var storage = firebase.storage();
  const storage = getStorage();
  
  const postId = req.params.id;
  try {
    let neededPost = await pool.query('SELECT * FROM posts WHERE id = $1', [postId])

    if (!neededPost.rowCount) {
      return Err(req, res, "Post does not exist");
    }
    neededPost = neededPost.rows[0];
    console.log("POST(TO BE DELETED) TITLE=", neededPost.title);

    // let filePath = path.join(__dirname, "../../public", neededPost.cover);
    // console.log("img path=", filePath);
    const deletedImg = await delFile(storage.refFromURL(neededPost.cover));
    console.log("img deleted", deletedImg);
    // fs.unlink(filePath, (err) => {
    //   if (err) console.error("ERROR IN IMG REMOVAL", err.message);
    //   else console.log("IMAGE DELETED FROM", filePath);
    // });


    const deletedPost = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *;", [postId]);
    console.log("DELETED=", deletedPost.rows[0]);

    return res.send({
      status: "ok",
      message: "Post deleted successfully",
      post: deletedPost.rows[0]
    });
  } catch (err) {
    return Err(req, res, err.message);
  }
};
module.exports = { deletePost };
