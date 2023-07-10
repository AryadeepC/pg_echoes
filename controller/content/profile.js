const { userModel } = require("../../models/User");
const { Err } = require("../../utils/ErrorResponse");

const profilePage = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return Err(req, res, "Id missing. Bad request");
  }
  try {
    const userInDb = await userModel
      .findById(id)
      .populate("posts")
      .select(["username", "email", "posts"]);

    // console.log("profile", userInDb);

    let view = 0,
      posts = userInDb.posts.length;

    userInDb.posts.forEach((post) => {
      view += post.views;
    });

    console.log("Views: ", view, " ", posts);
    return res.send({
      status: "ok",
      message: "profile sent",
      profile: {
        username: userInDb.username,
        views: view,
        email: userInDb.email,
        posts,
      },
    });
  } catch (error) {
    return Err(req, res, "Error in profile" + error.message);
  }
};

module.exports = { profilePage };
