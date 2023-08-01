const router = require("express").Router();
const { fetchAll, fetchSingle } = require("../controller/content/fetchPost");
const { deletePost } = require("../controller/content/deletePost");
const { addView, updPosts } = require("../controller/content/modPost");
const createPost = require("../controller/content/createPost");
const upload = require("../middlewares/multer");
const authorize = require("../middlewares/authorize");
const { search } = require("../controller/content/search");
const { fetchLimit, postLimit } = require("../utils/rateLimit");

router.get("/", (req, res) => res.send("in post"));

router.get("/all", fetchLimit, fetchAll);
router.get("/fetch/:id", fetchLimit, fetchSingle);
router.get("/search", fetchLimit, search);

// router.post("/create", authorize, upload.single("cover_photo"), createPost);
router.post("/create", postLimit, upload.single("cover_photo"), createPost);

router.put("/views/:id", addView);
router.put("/update/:id", postLimit, authorize, upload.single("cover_photo"), updPosts);

router.delete("/delete/:id", authorize, deletePost);

module.exports = router;
