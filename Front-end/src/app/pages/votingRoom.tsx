import React, { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Vote,
  Trophy,
  Plus,
  Play,
  BarChart3,
  Check,
  UserCheck,
  Crown,
  Target,
} from "lucide-react";
import { useGetParticipantQuery } from "@/api/get-Participant";

interface ParticipantsProps {
  roomCode: string;
}

export const RoomView: React.FC<ParticipantsProps> = ({ roomCode }) => {
  const { data, error, isLoading } = useGetParticipantQuery({ roomCode });
  const [voteOptions, setVoteOptions] = useState([""]);
  const [voteTitle, setVoteTitle] = useState("");
  const [votingDuration, setVotingDuration] = useState({
    days: 0,
    hours: 1,
    minutes: 0,
  });
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [votes, setVotes] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [votedParticipants, setVotedParticipants] = useState(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const participants = data || [];

  // Timer effect for active voting
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isVotingActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsVotingActive(false);
    }
    return () => clearInterval(interval);
  }, [isVotingActive, timeRemaining]);

  const addVoteOption = () => {
    setVoteOptions([...voteOptions, ""]);
  };

  const updateVoteOption = (index: number, value: string) => {
    const newOptions = [...voteOptions];
    newOptions[index] = value;
    setVoteOptions(newOptions);
  };

  const removeVoteOption = (index: number) => {
    if (voteOptions.length > 1) {
      setVoteOptions(voteOptions.filter((_, i) => i !== index));
    }
  };

  const startVoting = () => {
    if (voteTitle && voteOptions.filter((opt) => opt.trim()).length >= 2) {
      const totalSeconds =
        votingDuration.days * 24 * 60 * 60 +
        votingDuration.hours * 60 * 60 +
        votingDuration.minutes * 60;
      setTimeRemaining(totalSeconds);
      setIsVotingActive(true);
      setVotes({});
      setUserVote(null);
      setVotedParticipants(new Set());
      setShowResults(false);
      setShowWinner(false);
    }
  };

  const castVote = (optionIndex) => {
    if (!userVote && isVotingActive) {
      setUserVote(optionIndex);
      setVotes((prev) => ({
        ...prev,
        [optionIndex]: (prev[optionIndex] || 0) + 1,
      }));
      // Simulate current user voting
      const currentUser = participants[0];
      if (currentUser) {
        setVotedParticipants((prev) => new Set([...prev, currentUser._id]));
      }
    }
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h ${mins}m ${secs}s`;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const getResults = () => {
    const totalVotes = Object.values(votes).reduce(
      (sum, count) => sum + (count as number),
      0
    );
    return voteOptions
      .filter((opt) => opt.trim())
      .map((option, index) => ({
        option,
        votes: votes[index] || 0,
        percentage:
          totalVotes > 0
            ? (((votes[index] || 0) / totalVotes) * 100).toFixed(1)
            : 0,
      }))
      .sort((a, b) => b.votes - a.votes);
  };

  const getWinner = () => {
    const results = getResults();
    return results.length > 0 ? results[0] : null;
  };

  const getParticipantInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading voting room...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-600">
            Unable to load participants. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Vote className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Decision Room
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
              {roomCode}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Side - Create Decision */}
          <div className="lg:col-span-2 space-y-6">
            {/* Decision Creation */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Decision
                </h2>
                <p className="text-gray-600">
                  Set up your voting question and options
                </p>
              </div>

              <div className="space-y-6">
                {/* Decision Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What needs to be decided?
                  </label>
                  <input
                    type="text"
                    value={voteTitle}
                    onChange={(e) => setVoteTitle(e.target.value)}
                    placeholder="Enter your decision question..."
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                  />
                </div>

                {/* Decision Options */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Available Options
                  </label>
                  <div className="space-y-3">
                    {voteOptions.map((option, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateVoteOption(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        />
                        {voteOptions.length > 1 && (
                          <button
                            onClick={() => removeVoteOption(index)}
                            className="flex-shrink-0 w-12 h-12 text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addVoteOption}
                    className="mt-4 px-6 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-2 font-medium border border-indigo-200 hover:border-indigo-300"
                  >
                    <Plus size={18} />
                    Add Another Option
                  </button>
                </div>

                {/* Duration Settings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Voting Duration
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: "days", label: "Days", max: 365 },
                      { key: "hours", label: "Hours", max: 23 },
                      { key: "minutes", label: "Minutes", max: 59 },
                    ].map(({ key, label, max }) => (
                      <div key={key} className="text-center">
                        <label className="block text-sm text-gray-600 mb-2 font-medium">
                          {label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={max}
                          value={votingDuration[key]}
                          onChange={(e) =>
                            setVotingDuration((prev) => ({
                              ...prev,
                              [key]: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center font-mono bg-gray-50 focus:bg-white text-lg font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Decision Button */}
                <button
                  onClick={startVoting}
                  disabled={
                    !voteTitle ||
                    voteOptions.filter((opt) => opt.trim()).length < 2
                  }
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Play size={24} />
                  Start Decision Process
                </button>
              </div>
            </div>

            {/* Active Voting Section */}
            {isVotingActive && voteTitle && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {voteTitle}
                  </h3>
                  <p className="text-gray-600">
                    Cast your vote by selecting an option below
                  </p>
                  {timeRemaining && (
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mt-3">
                      <Clock size={16} />
                      {formatTime(timeRemaining)}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {voteOptions
                    .filter((opt) => opt.trim())
                    .map((option, index) => (
                      <button
                        key={index}
                        onClick={() => castVote(index)}
                        disabled={userVote !== null || !isVotingActive}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
                          userVote === index
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-lg shadow-green-500/20"
                            : userVote !== null || !isVotingActive
                              ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              userVote === index
                                ? "bg-green-500 text-white"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white group-hover:from-indigo-600 group-hover:to-purple-600"
                            }`}
                          >
                            {userVote === index
                              ? "✓"
                              : String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-lg block">
                              {option}
                            </span>
                            {userVote === index && (
                              <span className="text-green-600 font-medium text-sm">
                                Your Choice
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                {userVote !== null && (
                  <div className="text-center bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                    <UserCheck
                      className="text-green-600 mx-auto mb-2"
                      size={24}
                    />
                    <p className="text-green-700 font-semibold">
                      Your vote has been recorded!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Participants & Controls */}
          <div className="space-y-6">
            {/* Participants Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Users className="text-indigo-500" size={20} />
                  Participants
                </h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {participants.length}
                </span>
              </div>

              {participants.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-gray-400" size={20} />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Waiting for participants...
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {participants.map((participant) => {
                    const hasVoted = votedParticipants.has(participant._id);
                    return (
                      <div
                        key={participant._id}
                        className={`relative p-3 rounded-lg border transition-all duration-200 ${
                          hasVoted
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              hasVoted
                                ? "bg-green-500 text-white"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            }`}
                          >
                            {hasVoted
                              ? "✓"
                              : getParticipantInitials(participant.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm truncate">
                              {participant.name}
                            </p>
                            {hasVoted && (
                              <span className="text-xs text-green-600 font-medium">
                                Voted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Voting Progress */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Participation</span>
                  <span>
                    {participants.length > 0
                      ? Math.round(
                          (votedParticipants.size / participants.length) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${participants.length > 0 ? (votedParticipants.size / participants.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-4">
              {/* Show Results Button */}
              <button
                onClick={() => setShowResults(!showResults)}
                disabled={
                  Object.values(votes).reduce(
                    (sum, count) => sum + count,
                    0
                  ) === 0
                }
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <BarChart3 size={20} />
                {showResults ? "Hide Results" : "Show Results"}
              </button>

              {/* Show Winner Button */}
              <button
                onClick={() => setShowWinner(!showWinner)}
                disabled={
                  Object.values(votes).reduce(
                    (sum, count) => sum + count,
                    0
                  ) === 0
                }
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Crown size={20} />
                {showWinner ? "Hide Winner" : "Show Winner"}
              </button>
            </div>

            {/* Results Display */}
            {showResults && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-500" size={20} />
                  Live Results
                </h3>
                <div className="space-y-3">
                  {getResults().map((result, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(
                              65 + voteOptions.indexOf(result.option)
                            )}
                          </span>
                          <span className="font-medium text-sm">
                            {result.option}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">
                            {result.votes}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Winner Display */}
            {showWinner && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border border-yellow-200">
                <div className="text-center">
                  <Crown className="text-yellow-600 mx-auto mb-3" size={32} />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Winner!
                  </h3>
                  {getWinner() ? (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        Option{" "}
                        {String.fromCharCode(
                          65 + voteOptions.indexOf(getWinner().option)
                        )}
                      </div>
                      <div className="font-semibold text-gray-800 mb-2">
                        {getWinner().option}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getWinner().votes} votes ({getWinner().percentage}%)
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No votes yet!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
