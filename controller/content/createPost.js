const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const crypto = require("crypto");
const { pool } = require("../../config/db");
const jwt = require("jsonwebtoken");
const { Err } = require("../../utils/ErrorResponse");
const sanitizeHtml = require('sanitize-html')
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const crypto = require('crypto')

const create = async (req, res) => {
  const storage = getStorage();

  let cover = "";
  const { title, summary, body } = req.body;
  if (!title || !summary || !body) {
    return Err(req, res, "Posts field missing!");
  }

  try {
    if (!req.userId) {
      return Err(req, res, "Token invalid. Missing id!");
    }

    if (req.file) {
      const filler = crypto.randomBytes(8).toString('hex');
      const storageRef = ref(storage, `uploads/${String(Date.now()) + filler}`)
      const metadata = {
        contentType: req.file.mimetype,
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      cover = await getDownloadURL(snapshot.ref)
      console.log("cover=", cover);

    }

    // const cleanBody = sanitizeHtml(body, {
    //   allowedTags: [],
    //   allowedAttributes: {}
    // });

    let postObj = await pool.query('INSERT INTO posts (id, author, author_id, title, summary, body, cover, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;', [crypto.randomUUID(), req.userName, req.userId, title, summary, body, cover, new Date(), new Date()]);

    const updtVectors = await pool.query("UPDATE posts SET search_docs = setweight(to_tsvector(title), 'A') || setweight(to_tsvector(author), 'B') || setweight(to_tsvector(summary), 'C') || setweight(to_tsvector(body), 'D');", [])

    console.log(updtVectors.rowCount ? updtVectors.rows : "not updated")

    if (postObj.rowCount > 0) {
      postObj = postObj.rows[0];
    }

    console.log("whole post:", postObj);
    return res.send({ status: "ok", message: "posted", id: postObj.id });
  } catch (error) {
    // console.error(error)
    return Err(req, res, error.message);
  }

  res.end();
};
module.exports = create;
