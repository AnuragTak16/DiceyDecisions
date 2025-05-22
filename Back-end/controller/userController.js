// controllers/authController.js (or similar file)
const User = require("../model/signupUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const Room = require("../model/room");

const home = (req, res) => {
  res.send("Hello from the server");
};

//signup user API
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
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

//login User API
const loginPage = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    //JWT token create
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // send to fronted
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//RoomCreate APi
const createRoom = async (req, res) => {
  try {
    const { title, description, maxParticipants } = req.body;
    const creatorId = req.user.id; //some kind of authentication middleware

    const roomCode = nanoid(6).toUpperCase();
    const inviteLink = `https://diceydecisions.app/room/${roomCode}`;

    const newRoom = await Room.create({
      title,
      description,
      maxParticipants,
      creatorId,
      roomCode,
      inviteLink,
    });

    res.status(201).json({
      message: "Room created successfully!",
      roomCode,
      inviteLink,
    });
  } catch (err) {
    console.error("Error creating room:", err);
    res
      .status(500)
      .json({ message: "Failed to create room", error: err.message });
  }
};

module.exports = { signup, home, loginPage, createRoom };
