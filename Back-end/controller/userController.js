// controllers/authController.js (or similar file)
const User = require("../model/signupUser");
const bcrypt = require("bcrypt");

const home = (req, res) => {
  res.send("Hello from the server");
};

//signup API
const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  if (password !== confirmPassword) {
    return res
      .status(422)
      .json({ error: "Password and Confirm Password do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user (do not save confirmPassword)
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, home };
