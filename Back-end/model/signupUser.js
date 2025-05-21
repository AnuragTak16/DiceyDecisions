const mongoose = require("mongoose");

const signupUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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

const SignupUser = mongoose.model("SignupUser", signupUserSchema);
module.exports = SignupUser;
