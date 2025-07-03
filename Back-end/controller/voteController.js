const Vote = require('../model/vote');

const createVote = async (req, res) => {
  try {
    const {
      title,
      options = [],
      allowCustomOptions = false,
      duration, // expecting { days, hours, minutes }
    } = req.body;
    const creatorId = req.user.id;

    const formattedOptions = options.map((opt) => ({
      id: uuidv4(),
      text: opt,
      count: 0,
    }));

    const startTime = new Date();
    // Calculate endTime based on duration
    const endTime = new Date(
      startTime.getTime() +
        duration.days * 24 * 60 * 60 * 1000 +
        duration.hours * 60 * 60 * 1000 +
        duration.minutes * 60 * 1000
    );

    const newVote = await Vote.create({
      title,
      creatorId,
      options: formattedOptions,
      allowCustomOptions,
      duration, // store duration object
      startTime,
      endTime,
    });

    await newVote.save();

    res.status(201).json({ message: 'Vote created', vote: newVote });
  } catch (err) {
    console.error('Create Vote Error:', err);
    res.status(500).json({ error: 'Failed to create vote' });
  }
};

//open vote for voting
const openVote = async (req, res) => {
  const { voteId } = req.params;
  const vote = await Vote.findById(voteId);

  if (!vote) return res.status(404).json({ error: 'Vote not found' });

  // Set current time as startTime
  const now = new Date();
  vote.startTime = now;

  // Calculate endTime based on durationMinutes
  const minutes = vote.durationMinutes || 0;
  vote.endTime = new Date(now.getTime() + minutes * 60000);

  vote.isOpen = true;
  vote.hasEnded = false;

  await vote.save();
  res.json({ message: 'Voting opened', vote });
};

//cast votes means started voting
const { v4: uuidv4 } = require('uuid');

const castVote = async (req, res) => {
  const { voteId } = req.params;
  const { optionId, customOptionText } = req.body;
  const userId = req.user.id;

  try {
    const vote = await Vote.findById(voteId);
    if (!vote) return res.status(404).json({ error: 'Vote not found' });

    // Removed the check for vote.isOpen and vote.hasEnded here

    if (vote.votedUsers.includes(userId))
      return res.status(403).json({ error: 'You have already voted' });

    let optionFound = false;

    if (customOptionText && vote.allowCustomOptions) {
      const newOption = { id: uuidv4(), text: customOptionText, count: 1 };
      vote.options.push(newOption);
      optionFound = true;
    } else {
      vote.options = vote.options.map((opt) => {
        if (opt.id === optionId) {
          optionFound = true;
          return { ...opt, count: opt.count + 1 };
        }
        return opt;
      });
    }

    if (!optionFound)
      return res.status(400).json({ error: 'Option not found' });

    vote.votedUsers.push(userId);
    await vote.save();

    const totalVotes = vote.votedUsers.length;
    const maxVotes = Math.max(...vote.options.map((o) => o.count));
    const winners = vote.options.filter((o) => o.count === maxVotes);

    res.json({
      message: 'Vote recorded',
      totalVotes,
      options: vote.options,
      winners,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getVotes = async (req, res) => {
  try {
    const { roomId } = req.params;
    const votes = await Vote.find({ roomCode: roomId });
    if (!votes) {
      return res.status(404).json({ error: 'No votes found for this room' });
    }
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//get all details of votes
const getVotingList = async (req, res) => {
  try {
    const votes = await Vote.find();

    if (!votes || votes.length === 0) {
      return res.status(404).json({ error: 'No votes found' });
    }

    const formattedVotes = votes.map((vote) => {
      const now = new Date();
      const endTime = vote.endTime;
      const timeRemaining = endTime > now ? endTime - now : 0; // ms

      return {
        ...vote.toObject(),
        timeRemainingMs: timeRemaining,
        // You can also format startTime/endTime here if needed, e.g.:
        // startTimeFormatted: vote.startTime.toISOString(),
        // endTimeFormatted: vote.endTime.toISOString(),
      };
    });

    res.json(formattedVotes);
  } catch (error) {
    console.error('Get Voting List Error:', error);
    res.status(500).json({ error: 'Failed to retrieve votes' });
  }
};

//close voting
const closeVote = async (req, res) => {
  const { voteId } = req.params;
  const vote = await Vote.findById(voteId);

  if (!vote) return res.status(404).json({ error: 'Vote not found' });

  vote.hasEnded = true;
  vote.isOpen = false;
  await vote.save();

  res.json({ message: 'Voting ended' });
};

//result one
const getResults = async (req, res) => {
  try {
    const { voteId } = req.params;

    // Validate voteId
    if (!mongoose.Types.ObjectId.isValid(voteId)) {
      return res.status(400).json({ error: 'Invalid vote ID format' });
    }

    const vote = await Vote.findById(voteId);

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    if (!vote.hasEnded) {
      return res.status(403).json({ error: 'Results not available yet' });
    }

    const options = vote.options.map((opt) => ({
      id: opt._id,
      text: opt.option,
      count: opt.count,
    }));

    const maxVotes = Math.max(...options.map((opt) => opt.count));
    const topOptions = options.filter((opt) => opt.count === maxVotes);

    let winner;
    let tiebreakerUsed = false;
    let tiebreakerMethod = null;

    if (topOptions.length === 1) {
      // Clear winner
      winner = topOptions[0];
    } else {
      // Tie: Apply tiebreaker (e.g., random selection, coin toss, dice roll)
      tiebreakerUsed = true;

      // Example 1: Random selection among tied options (fair tiebreaker)
      const randomIndex = Math.floor(Math.random() * topOptions.length);
      winner = topOptions[randomIndex];
      tiebreakerMethod = 'random';
    }

    res.status(200).json({
      voteId: vote._id,
      title: vote.title,
      options,
      totalVotes: options.reduce((sum, opt) => sum + opt.count, 0),
      winner,
      tiebreakerUsed,
      tiebreakerMethod,
    });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//getPastPOLL
const getPastPoll = async (req, res) => {
  try {
    const polls = await Poll.find({ creatorId: req.params.creatorId }).sort({
      createdAt: -1,
    });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//voting-id we get

const getvotingRoomId = async (req, res) => {
  try {
    const room = await VotingRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getVotingList,
  getResults,
  closeVote,
  castVote,
  openVote,
  getVotes,
  createVote,
  getPastPoll,
  getvotingRoomId,
};
