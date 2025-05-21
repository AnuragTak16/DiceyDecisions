const mongoose = require("mongoose");

const signinUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const signinUser = mongoose.model("signinUser", signinUserSchema);
module.exports = signin;
