const { demoLimit } = require("../utils/rateLimit");

const router = require("express").Router();

router.get("/hi", (req, res) => {
  console.log("home");
  console.log("🍘", req.cookies);
  // res.cookie("sky", "blue");
  res.send("In the router");
});


router.get("/demo", demoLimit, (req, res) => {
  console.log("demo route");
  res.send("demo page");
});

module.exports = router;
