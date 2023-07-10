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

router.get("/", veriftJwt);
router.get("/posts", authorize, getUserPosts);
router.get("/profile/:id", authorize, profilePage);
router.get("/logout", logoutController);
router.get("/forgot", authorize, forgotPassword);

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/reset", authorize, resetPassword);

module.exports = router;
