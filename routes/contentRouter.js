const router = require("express").Router();
const { fetchAll, fetchSingle } = require("../controller/content/fetchPost");
const { deletePost } = require("../controller/content/deletePost");
const { addView, updPosts } = require("../controller/content/modPost");
const createPost = require("../controller/content/createPost");
const upload = require("../middlewares/multer");
const authorize = require("../middlewares/authorize");

router.get("/", (req, res) => res.send("in post"));
router.get("/all", fetchAll);
router.get("/fetch/:id", fetchSingle);

router.post("/create", authorize, upload.single("cover_photo"), createPost);

router.put("/views/:id", addView);
router.put("/update/:id", authorize, upload.single("cover_photo"), updPosts);

router.delete("/delete/:id", authorize, deletePost);

module.exports = router;
