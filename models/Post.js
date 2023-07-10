const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    author: String,
    authorDetails: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    title: String,
    summary: String,
    body: String,
    cover: String,
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);
module.exports = { postSchema, postModel };
