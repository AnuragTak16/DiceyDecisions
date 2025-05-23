const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");
const {
  signup,
  home,
  loginPage,
  createRoom,
  joinRoom,
  getCreatedRooms,
  roomDetails,
} = require("../controller/userController");

//methods::
router.get("/", home);
router.post("/signup", signup);
router.post("/login", loginPage);
router.post("/room", authenticate, createRoom);
router.post("/join", authenticate, joinRoom);
router.get("/creatorRoom", authenticate, getCreatedRooms);
router.get("/roomDetails", authenticate, roomDetails);

module.exports = router;
