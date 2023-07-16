const multer = require("multer");
const path = require("path");

const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const maxSize = 50 * 1024 * 1024; // 50MB

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: maxSize },
});

module.exports = upload;