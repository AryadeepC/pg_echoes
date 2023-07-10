const appRouter = require("express").Router();
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");
// const getRouter = require("./routes/getRouter");

appRouter.get("/", (req, res) => {
  console.log("HOME");
  // console.log("🍘:", req.cookies);
  res.render("index.ejs");
  res.end();
  // res.send("You're HOME");
});

appRouter.use("/user", authRouter);
appRouter.use("/post", postRouter);
appRouter.use("*", (req, res) => res.render("404.ejs"));

module.exports = appRouter;
