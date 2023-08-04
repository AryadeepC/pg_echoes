const router = require("express").Router();
const loginController = require("../controller/auth/login");
const registerController = require("../controller/auth/register");
const {
  forgotPassword,
  resetPassword,
} = require("../controller/auth/password");
const veriftJwt = require("../controller/auth/verify");
const { getUserPosts } = require("../controller/content/fetchPost");
const authorize = require("../middlewares/authorize");
const { profilePage } = require("../controller/content/profile");
const { logoutController } = require("../controller/auth/logout");
const { authLimit, fetchLimit } = require("../utils/rateLimit");

router.get("/", veriftJwt);
router.get("/posts", fetchLimit, authorize, getUserPosts);
router.get("/profile/:id", authorize, profilePage);
router.get("/forgot", authorize, forgotPassword);

router.post("/login", authLimit, loginController);
router.post("/register", authLimit, registerController);
router.post("/reset", authorize, resetPassword);

router.delete("/logout", logoutController);

module.exports = router;
