const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");

const fetchAll = async (req, res) => {
  // console.log("FETCHING ALL");
  try {
    const postPool = await pool.query('SELECT * FROM posts ORDER BY ts_rank(search_docs);');
    console.log("total posts=", postPool.rowCount);
    return res.send({
      status: "ok",
      message: "fetching all posts",
      posts: postPool.rows,
    });
  } catch (error) {
    return Err(req, res, "Failed to fetch all posts\n" + error.message);
  }
};

const fetchSingle = async (req, res) => {
  const { id } = req.params;
  // console.log("Fetching one");
  try {
    const singlePost = await pool.query('SELECT * FROM posts WHERE id = $1;', [id]);
    console.log("SINGLE POST:TITLE=", singlePost.rows[0].title);

    return res.send({
      status: "ok",
      message: "fetching single",
      post: singlePost.rows[0],
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
    const extUserPosts = await pool.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC;', [req.userId]);
    console.log("TOTAL USER'S POST=", extUserPosts.rowCount);
    let arr = extUserPosts.rows;
    return res.send({ status: "ok", posts: arr });
  } catch (error) {
    return Err(req, res, "Error in fetching user posts" + error.message);
  }
};

module.exports = { fetchAll, fetchSingle, getUserPosts };
