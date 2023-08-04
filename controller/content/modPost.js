const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage")
const sanitizeHtml = require('sanitize-html')
const crypto = require('crypto')

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
  let lastCover;
  const storage = getStorage();
  // console.log(req.body.emptyPic, typeof req.body.emptyPic, !!req.file)
  const postId = req.params.id;
  const { title, summary, body, emptyPic } = req.body;
  let cover = "";
  console.log("UPDATING=", postId, !!title);

  try {
    if (req.file || emptyPic == "true") {
      console.log("PURGING LAST COVER IMG")
      const lastCoverPost = await pool.query('SELECT cover FROM posts WHERE id = $1;', [postId]);
      lastCover = lastCoverPost.rows[0].cover;
      console.log("last cover present=", lastCover);
    }

    if (req.file) {
      const filler = crypto.randomBytes(8).toString('hex');
      const storageRef = ref(storage, `uploads/${String(Date.now()) + filler}`)
      const metadata = {
        contentType: req.file.mimetype,
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      cover = await getDownloadURL(snapshot.ref)
    }

    if (emptyPic === "true") {
      cover = null;
    }

    console.log("cover=", cover);

    const post = await pool.query('UPDATE posts SET title = $1, summary = $2, body = $3, updated_at = $4 WHERE id = $5 RETURNING *;', [title, summary, body, new Date(), postId]);

    const updtVectors = await pool.query("UPDATE posts SET search_docs = setweight(to_tsvector(title), 'A') || setweight(to_tsvector(author), 'B') || setweight(to_tsvector(summary), 'C') || setweight(to_tsvector(body), 'D');", [])

    console.log(updtVectors.rowCount ? updtVectors.rows : "not updated")

    if (!post.rowCount) {
      return Err(req, res, "POST UPDATION FAILED!!");
    }
    if (cover || cover == null) {
      const coverChange = await pool.query('UPDATE posts SET cover = $1 WHERE id = $2 RETURNING *;', [cover, postId])
      if (!coverChange.rowCount)
        return Err(req, res, "COVER PHOTO UPDATION FAILED!!");
    }
    console.log("UPDATED POST=", post.rows[0].id);
    res.send({ status: "ok", message: "updated post", id: post.rows[0].id });

    if (lastCover != null || lastCover) {
      var withoutTokenUrl = lastCover.split('?');
      var pathUrl = withoutTokenUrl[0].split('/');
      var filePath = pathUrl[pathUrl.length - 1].replace("%2F", "/");
      console.log("lastFilePath=", filePath);
      const imgRef = ref(storage, filePath);

      const deletedImg = await deleteObject(imgRef);
      console.log("img deleted", deletedImg);
    }
    return;
  } catch (err) {
    return Err(req, res, "Error while updating post" + err.message);
  }
};

module.exports = { addView, updPosts };
