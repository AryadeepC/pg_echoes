const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
  resetPasswordToken: String,
  resetPasswordExpiry: Number,
});

const userModel = mongoose.model("user", userSchema);
module.exports = { userSchema, userModel };
