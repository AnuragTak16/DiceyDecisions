const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authentication');
const {
  signup,
  home,
  loginPage,
  createRoom,
  joinRoom,
  getCreatedRooms,
  roomDetails,
  getParticipantNames,
} = require('../controller/userController');

const {
  createVote,
  openVote,
  castVote,
  getResults,
  getVotes,
  getVotingList,
  getPastPoll,
  getvotingRoomId,
} = require('../controller/voteController');

//methods::
router.get('/', home);
router.post('/signup', signup);
router.post('/login', loginPage);
router.post('/room', authenticate, createRoom);
router.post('/join', authenticate, joinRoom);
router.get('/creatorRoom', authenticate, getCreatedRooms);
router.get('/roomDetails', authenticate, roomDetails);
router.get('/room/:roomcode/participants', getParticipantNames);

//votes routes

router.post('/vote', authenticate, createVote);
router.post('/vote/:voteId/open', authenticate, openVote);
router.post('/vote/:voteId/cast', authenticate, castVote);
router.get('/votes', authenticate);
router.get('/:voteId/results', getResults);
router.get('/vote/:roomId', authenticate, getVotes);
router.get('/votingList', authenticate, getVotingList);
router.get('/polls/byCreator/:creatorId', getPastPoll);
router.get('/api/voting-room/:id', getvotingRoomId);

module.exports = router;
