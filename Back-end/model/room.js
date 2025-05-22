// models/Room.js backend me store hone vala
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  maxParticipants: {
    type: Number,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SigninUser",
    required: true,
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },
  inviteLink: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
