const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config.env") });
const crypto = require("crypto");
const { pool } = require("../../config/db");
const jwt = require("jsonwebtoken");
const { Err } = require("../../utils/ErrorResponse");
const { getStorage, ref, getDownloadUrl, uploadBytesResumable } = require("firebase/storage")

const create = async (req, res) => {
  const storage = getStorage();

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

    // if (req.file) {
    //   cover = req.file.location;
    //   console.log("cover", cover);  
    // }
    if (req.file) {
      // console.log(req.file)
      const { filename } = req.file;
      const storageRef = ref(storage, `uploads/${filename}`)
      const metadata = {
        contentType: req.file.mimetype,
      }
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      cover = await getDownloadUrl(snapshot.ref)
      console.log("cover=", cover);
      // if (filename) {
        // cover = "/uploads/" + filename;
      // }
    }

    let postObj = await pool.query('INSERT INTO posts (id, author, author_id, title, summary, body, cover, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;', [crypto.randomUUID(), decoded.name, decoded.id, title, summary, body, cover, new Date(), new Date()]);

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
