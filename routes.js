const appRouter = require("express").Router();
const contentRouter = require("./routes/contentRouter");
const authRouter = require("./routes/authRouter");
const { demoLimit } = require("./utils/rateLimit");
// const getRouter = require("./routes/getRouter");

appRouter.get("/", (req, res) => {
  console.log("HOME");
  // console.log("🍘:", req.cookies);
  res.render("index.ejs");
  res.end();
  // res.send("You're HOME");
});

appRouter.get('/ip', (request, response) => response.send(request.ip))


appRouter.get("/demo", demoLimit, (req, res) => {
  console.log("demo route");
  res.send("demo page");
});

appRouter.use("/user", authRouter);
appRouter.use("/post", contentRouter);
appRouter.use("*", (req, res) => res.render("404.ejs"));

module.exports = appRouter;
