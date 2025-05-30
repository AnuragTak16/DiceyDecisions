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
  getParticipants,
  deleteRoom,
} = require("../controller/userController");

const {
  createVote,
  openVote,
  castVote,
  getResults,
  closeVote,
  getVotes,
  getVotingList,
} = require("../controller/voteController");

//methods::
router.get("/", home);
router.post("/signup", signup);
router.post("/login", loginPage);
router.post("/room", authenticate, createRoom);
router.post("/join", authenticate, joinRoom);
router.get("/creatorRoom", authenticate, getCreatedRooms);
router.get("/roomDetails", authenticate, roomDetails);
router.delete("/rooms/:id", authenticate, deleteRoom);

router.get("/roomParticipant/:code", getParticipants);

//votes routes

router.post("/vote", authenticate, createVote);
router.post("/vote/:voteId/open", authenticate, openVote);
router.post("/vote/:voteId/cast", authenticate, castVote);
router.get("/votes", authenticate, closeVote);
router.get("/:voteId/results", getResults);
router.get("/vote/:roomId", authenticate, getVotes);
router.get("/votingList", authenticate, getVotingList);

module.exports = router;
