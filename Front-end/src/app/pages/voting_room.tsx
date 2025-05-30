import { useState, useEffect } from "react";
import {
  Vote,
  StopCircle,
  Play,
  Pause,
  Eye,
  UserCheck,
  Trophy,
  Crown,
} from "lucide-react";
import { useGetVotingListQuery } from "@/api/get-all-voting_List";
import { useCastVoteMutation } from "@/api/cast-api";
import { useGetVoteResultsQuery } from "@/api/get-result";
// import { useNavigate } from "@tanstack/react-router";

interface ParticipantsProps {
  voteId: string;
}

interface VoteOption {
  id: string;
  text: string;
  count: number;
  _id: string;
}

interface Duration {
  days: number;
  hours: number;
  minutes: number;
}

interface VoteData {
  _id: string;
  title: string;
  options: VoteOption[];
  createdAt?: string;
  duration: Duration;
  startTime: string;
  endTime: string;
}

interface VoteResult {
  _id: string;
  title: string;
  options: VoteOption[];
  totalVotes: number;
  winner?: {
    id: string;
    text: string;
    count: number;
    percentage: number;
  };
  isCompleted: boolean;
}

export const VotingRoom = ({ voteId }: ParticipantsProps) => {
  const { data: votes } = useGetVotingListQuery();
  // const navigate = useNavigate();
  const [castVote] = useCastVoteMutation();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);

  const latestVote =
    votes && votes.length > 0
      ? votes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          )[0]
      : null;

  // Get vote results using your API
  const {
    data: voteResults,
    isLoading: isLoadingResults,
    error: resultsError,
    refetch: refetchResults,
  } = useGetVoteResultsQuery(latestVote?._id || "", {
    skip: !latestVote?._id || !showDetailedResults,
  });

  const [actualEndTime, setActualEndTime] = useState<Date | null>(
    latestVote ? new Date(latestVote.endTime) : null
  );

  useEffect(() => {
    if (latestVote && !actualEndTime) {
      setActualEndTime(new Date(latestVote.endTime));
    }
  }, [latestVote, actualEndTime]);

  const totalVotes = latestVote
    ? latestVote.options.reduce((sum, option) => sum + option.count, 0)
    : 0;

  const calculateTimeLeft = () => {
    if (!latestVote || !actualEndTime || isTimerStopped)
      return "Voting stopped";
    if (isTimerPaused) return "Timer paused";

    const now = new Date();
    const diffMs = actualEndTime.getTime() - now.getTime();

    if (diffMs <= 0) return "Voting ended";

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formatted = "";
    if (days > 0) formatted += `${days}d `;
    if (hours > 0 || days > 0) formatted += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) formatted += `${minutes}m `;
    formatted += `${seconds}s`;

    return formatted;
  };

  useEffect(() => {
    if (isTimerPaused || isTimerStopped) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [latestVote, isTimerPaused, isTimerStopped, actualEndTime]);

  const handleStopTimer = () => {
    setIsTimerStopped(true);
    setIsTimerPaused(false);
    setTimeLeft("Voting stopped");
  };

  const handlePauseTimer = () => {
    setIsTimerPaused(!isTimerPaused);
    if (!isTimerPaused) setTimeLeft("Timer paused");
  };

  const handleResumeTimer = () => {
    if (isTimerStopped) {
      setIsTimerStopped(false);
      setActualEndTime(new Date(Date.now() + 5 * 60 * 1000));
    }
    setIsTimerPaused(false);
  };

  const handleVote = async (optionId: string) => {
    if (hasVoted || !latestVote) return;
    try {
      setIsSubmitting(true);
      await castVote({ voteId: latestVote._id, optionId }).unwrap();
      setHasVoted(true);
      setSelectedOption(optionId);
    } catch (error) {
      console.error("Vote submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowResults = () => {
    setShowDetailedResults(!showDetailedResults);
    if (!showDetailedResults) {
      refetchResults();
    }
  };

  const getPercentage = (count: number) => {
    return totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : "0";
  };

  const getOptionColor = (index: number) => {
    const colors = [
      "from-emerald-400 to-teal-500",
      "from-blue-400 to-indigo-500",
      "from-amber-400 to-orange-500",
      "from-rose-400 to-pink-500",
      "from-violet-400 to-purple-500",
    ];
    return colors[index % colors.length];
  };

  const getTimerStatus = () => {
    if (isTimerStopped)
      return { color: "text-red-500", bg: "bg-red-50", icon: StopCircle };
    if (isTimerPaused)
      return { color: "text-amber-500", bg: "bg-amber-50", icon: Pause };
    return { color: "text-emerald-500", bg: "bg-emerald-50", icon: Play };
  };

  const timerStatus = getTimerStatus();

  // Find the winner from local data
  const getWinner = () => {
    if (!latestVote || latestVote.options.length === 0) return null;

    const sortedOptions = [...latestVote.options].sort(
      (a, b) => b.count - a.count
    );
    const winner = sortedOptions[0];

    if (winner.count === 0) return null;

    return {
      ...winner,
      percentage: getPercentage(winner.count),
    };
  };

  const winner = getWinner();

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center space-x-3 bg-white/60 rounded-full px-6 py-3 shadow-lg">
          <Vote className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">
            Live Voting Session
          </h1>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{latestVote?.title}</h2>
          <div
            className={`flex items-center px-3 py-2 rounded-lg ${timerStatus.bg}`}
          >
            <timerStatus.icon className={`h-4 w-4 ${timerStatus.color}`} />
            <span className={`ml-2 font-medium ${timerStatus.color}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {latestVote?.options.map((option, idx) => {
            const percentage = getPercentage(option.count);
            const isSelected = selectedOption === option.id;
            const isWinningOption = winner && winner.id === option.id;

            return (
              <div key={option.id} className="relative">
                zz
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
          <button
            onClick={() => setShowResults(!showResults)}
            className="flex items-center space-x-2 text-indigo-600 hover:underline"
          >
            <Eye className="h-4 w-4" />
            <span>{showResults ? "Hide Results" : "Show Results"}</span>
          </button>

          <button
            onClick={handleShowResults}
            disabled={!hasVoted && !showResults}
            className="flex items-center space-x-2 text-purple-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trophy className="h-4 w-4" />
            <span>
              {isLoadingResults ? "Loading..." : "View Detailed Results"}
            </span>
          </button>

          {hasVoted && (
            <div className="flex items-center space-x-2 text-emerald-600">
              <UserCheck className="h-4 w-4" />
              <span className="text-sm font-medium">
                Vote submitted successfully!
              </span>
            </div>
          )}
        </div>

        {/* Winner Display */}
        {winner && (hasVoted || showResults) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Current Leader
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium text-yellow-600">
                    {winner.text}
                  </span>{" "}
                  - {winner.count} votes ({winner.percentage}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Results Modal/Section */}
      {showDetailedResults && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Detailed Results</span>
            </h3>
            <button
              onClick={() => setShowDetailedResults(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {isLoadingResults ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading results...</p>
            </div>
          ) : resultsError ? (
            <div className="text-center py-8 text-red-600">
              <p>Error loading results. Please try again.</p>
              <button
                onClick={() => refetchResults()}
                className="mt-2 text-indigo-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : voteResults ? (
            <div className="space-y-4">
              {/* API Winner Display */}
              {voteResults.winner && (
                <div className="p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Crown className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        Winner!
                      </h4>
                      <p className="text-lg text-yellow-700 font-semibold">
                        {voteResults.winner.text}
                      </p>
                      <p className="text-sm text-gray-600">
                        {voteResults.winner.count} votes (
                        {voteResults.winner.percentage.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* All Results */}
              <div className="space-y-3">
                {(voteResults?.options ?? [])
                  .sort((a, b) => b.count - a.count)
                  .map((option, idx) => {
                    const percentage =
                      voteResults.totalVotes > 0
                        ? (
                            (option.count / voteResults.totalVotes) *
                            100
                          ).toFixed(1)
                        : "0";
                    const isWinner = voteResults.winner?.id === option.id;

                    return (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border ${
                          isWinner
                            ? "border-yellow-300 bg-yellow-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                idx === 0
                                  ? "bg-yellow-200 text-yellow-800"
                                  : idx === 1
                                    ? "bg-gray-200 text-gray-800"
                                    : idx === 2
                                      ? "bg-orange-200 text-orange-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              #{idx + 1}
                            </span>
                            <span className="font-medium">{option.text}</span>
                            {isWinner && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {option.count} votes
                            </div>
                            <div className="text-sm text-gray-600">
                              {percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                isWinner
                                  ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                                  : `bg-gradient-to-r ${getOptionColor(idx)}`
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="pt-4 border-t text-center text-gray-600">
                <p>
                  Total Votes:{" "}
                  <span className="font-semibold">
                    {voteResults.totalVotes}
                  </span>
                </p>
                {voteResults.isCompleted && (
                  <p className="text-green-600 font-medium">
                    ✓ Voting Completed
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <p>No results available</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {!isTimerStopped && (
          <button
            onClick={handlePauseTimer}
            className="px-4 py-2 bg-amber-200 rounded-md hover:bg-amber-300 transition-colors"
          >
            {isTimerPaused ? "Resume" : "Pause"}
          </button>
        )}
        <button
          onClick={isTimerStopped ? handleResumeTimer : handleStopTimer}
          className={`px-4 py-2 ${
            isTimerStopped
              ? "bg-green-300 hover:bg-green-400"
              : "bg-red-300 hover:bg-red-400"
          } rounded-md transition-colors`}
        >
          {isTimerStopped ? "Restart" : "Stop"}
        </button>
      </div>
    </div>
  );
};
