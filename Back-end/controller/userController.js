// controllers/authController.js (or similar file)
const User = require("../model/signupUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const Room = require("../model/room");
const SignupUser = require("../model/signupUser");

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
    const token = jwt.sign(
      { userId: user._id, userName: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

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

//Join Room with code
const joinRoom = async (req, res) => {
  const userId = req.user?.id;
  const { roomCode } = req.body;

  if (!roomCode || !userId) {
    return res.status(400).json({ error: "Room code and login required" });
  }

  const room = await Room.findOne({ roomCode });
  if (!room) return res.status(404).json({ error: "Room not found" });
  if (!room.isOpen) return res.status(403).json({ error: "Room is closed" });

  const alreadyJoined = room.participants.some(
    (p) => p.userId?.toString() === userId
  );

  // ✅ If already joined, skip adding again and return success
  if (alreadyJoined) {
    return res.json({ message: "Already joined", roomId: room._id });
  }

  const user = await SignupUser.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Add user to participants list
  room.participants.push({
    name: user.name,
    userId: user._id,
  });

  await room.save();

  res.json({ message: "Joined successfully", roomId: room._id });
};

//Join Room with link
const joinRoomFromLink = async (req, res) => {
  const userId = req.user?.id; // from middleware
  const { roomCode } = req.params;

  if (!roomCode || !userId) {
    return res.status(400).json({ error: "Room code and login required" });
  }

  const room = await Room.findOne({ roomCode });
  if (!room) return res.status(404).json({ error: "Room not found" });
  if (!room.isOpen) return res.status(403).json({ error: "Room is closed" });

  const alreadyJoined = room.participants.some(
    (p) => p.userId?.toString() === userId
  );
  if (alreadyJoined) {
    return res.status(200).json({ message: "Already joined", room });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  room.participants.push({
    name: user.name,
    userId: user._id,
  });

  await room.save();

  res.status(200).json({ message: "Joined via link", room });
};

// GET-API/rooms-created
const getCreatedRooms = async (req, res) => {
  const userId = req.user?.id;
  // console.log(userId);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const rooms = await Room.find({ creatorId: userId });
  console.log(rooms);
  res.json(rooms);
};

//Get Api to show details

const roomDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.find({ creatorId: userId });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Failed to fetch room details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get room participants by room code and link
const getParticipants = async (req, res) => {
  console.log("room", req.params.code);

  try {
    const room = await Room.findOne({ roomCode: req.params.code });
    // .populate("participants.userId", "userName", " email")
    // .exec();

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json(room.participants);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//Decision API

module.exports = {
  signup,
  home,
  loginPage,
  createRoom,
  joinRoom,
  getCreatedRooms,
  roomDetails,
  getParticipants,
};
