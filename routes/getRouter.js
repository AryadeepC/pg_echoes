const router = require("express").Router();

router.get("/hi", (req, res) => {
  console.log("home");
  console.log("🍘", req.cookies);
  // res.cookie("sky", "blue");
  res.send("In the router");
});

module.exports = router;
