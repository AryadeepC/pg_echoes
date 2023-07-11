const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");

const profilePage = async (req, res) => {
  let view = 0, posts = 0;
  const { id } = req.params;
  if (!id) {
    return Err(req, res, "Id missing. Bad request");
  }
  try {
    // const userInDb = await userModel
    //   .findById(id)
    //   .populate("posts")
    //   .select(["username", "email", "posts"]);
    const userInDb = await pool.query('SELECT username,email FROM users WHERE id = $1;', [id]);

    console.log("profile", userInDb.rows[0]);

    const { rowCount, rows } = await pool.query('SELECT SUM(views) AS views,COUNT(*) as posts FROM posts WHERE author_id = $1;', [id]);
    if (rowCount > 0) {
      view = rows[0].views;
      posts = rows[0].posts;
    }

    console.log("Views:", view, "| Posts:", posts);
    return res.send({
      status: "ok",
      message: "profile sent",
      profile: {
        username: userInDb.rows[0].username,
        views: view,
        email: userInDb.rows[0].email,
        posts: posts,
      },
    });
  } catch (error) {
    return Err(req, res, "Error in profile" + '\n' + error.message);
  }
};

module.exports = { profilePage };
