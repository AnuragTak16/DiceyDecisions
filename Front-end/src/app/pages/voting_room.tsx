import { useState, useEffect } from 'react';
import {
  Vote,
  StopCircle,
  Play,
  Pause,
  Eye,
  UserCheck,
  Crown,
} from 'lucide-react';
import { useGetVotingListQuery } from '@/api/get-all-voting_List';
import { useCastVoteMutation } from '@/api/cast-api';
import { useGetVoteResultsQuery } from '@/api/get-result';
import { skipToken } from '@reduxjs/toolkit/query';

interface ParticipantsProps {
  voteId?: string; // optional since you use latestVote anyway
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

export const VotingRoom = ({ voteId }: ParticipantsProps) => {
  // Fetch all votes list
  const { data: votes } = useGetVotingListQuery();

  // Mutation for casting vote
  const [castVote] = useCastVoteMutation();

  // State for vote selection and submission
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer states
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Results display toggles
  const [showResults, setShowResults] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  // Select latest vote or by voteId if provided
  const latestVote: VoteData | null = voteId
    ? (votes?.find((v) => v._id === voteId) ?? null)
    : votes && votes.length > 0
      ? votes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt || '').getTime() -
              new Date(a.createdAt || '').getTime()
          )[0]
      : null;

  // Actual end time of current voting session
  const [actualEndTime, setActualEndTime] = useState<Date | null>(
    latestVote ? new Date(latestVote.endTime) : null
  );

  useEffect(() => {
    if (latestVote) {
      setActualEndTime(new Date(latestVote.endTime));
      setHasVoted(false);
      setSelectedOption(null);
      setShowResults(false);
      setShowDetailedResults(false);
      setIsTimerPaused(false);
      setIsTimerStopped(false);
    }
  }, [latestVote]);

  // Fetch detailed results only if toggled and latestVote is available
  const {
    data: voteResults,
    isLoading: isLoadingResults,
    error: resultsError,
    refetch: refetchResults,
  } = useGetVoteResultsQuery(latestVote?._id ?? skipToken, {
    skip: !latestVote?._id || !showDetailedResults,
  });

  // Calculate total votes from latestVote options
  const totalVotes = latestVote
    ? latestVote.options.reduce((sum, option) => sum + option.count, 0)
    : 0;

  // Helper: Calculate and format time left string
  const calculateTimeLeft = () => {
    if (!actualEndTime || isTimerStopped) return 'Voting stopped';
    if (isTimerPaused) return 'Timer paused';

    const now = new Date();
    const diffMs = actualEndTime.getTime() - now.getTime();

    if (diffMs <= 0) return 'Voting ended';

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formatted = '';
    if (days > 0) formatted += `${days}d `;
    if (hours > 0 || days > 0) formatted += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) formatted += `${minutes}m `;
    formatted += `${seconds}s`;

    return formatted;
  };

  // Update timeLeft every second if timer active
  useEffect(() => {
    if (isTimerPaused || isTimerStopped) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [actualEndTime, isTimerPaused, isTimerStopped]);

  // Handle pause/resume and stop timer
  const handlePauseToggle = () => {
    setIsTimerPaused((paused) => !paused);
  };

  const handleStopTimer = () => {
    setIsTimerStopped(true);
    setIsTimerPaused(false);
    setTimeLeft('Voting stopped');
  };

  const handleResumeTimer = () => {
    if (isTimerStopped) {
      // Resume voting by adding 5 min from now (example)
      setActualEndTime(new Date(Date.now() + 5 * 60 * 1000));
      setIsTimerStopped(false);
    }
    setIsTimerPaused(false);
  };

  // Submit vote handler
  const handleVote = async (optionId: string) => {
    if (hasVoted || !latestVote) return;
    setIsSubmitting(true);
    try {
      await castVote({ voteId: latestVote._id, optionId }).unwrap();
      setHasVoted(true);
      setSelectedOption(optionId);
    } catch (error) {
      console.error('Vote submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show detailed results toggle and refetch data
  const handleShowDetailedResults = () => {
    setShowDetailedResults((prev) => {
      if (!prev) refetchResults();
      return !prev;
    });
  };

  // Get percentage helper
  const getPercentage = (count: number) =>
    totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0';

  // Get colors for options
  const getOptionColor = (index: number) => {
    const colors = [
      'from-emerald-400 to-teal-500',
      'from-blue-400 to-indigo-500',
      'from-amber-400 to-orange-500',
      'from-rose-400 to-pink-500',
      'from-violet-400 to-purple-500',
    ];
    return colors[index % colors.length];
  };

  // Timer status display
  const getTimerStatus = () => {
    if (isTimerStopped)
      return { color: 'text-red-500', bg: 'bg-red-50', icon: StopCircle };
    if (isTimerPaused)
      return { color: 'text-amber-500', bg: 'bg-amber-50', icon: Pause };
    return { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Play };
  };
  const timerStatus = getTimerStatus();

  // Get current winner (local)
  const getWinner = () => {
    if (!latestVote || latestVote.options.length === 0) return null;
    const sorted = [...latestVote.options].sort((a, b) => b.count - a.count);
    const winner = sorted[0];
    if (winner.count === 0) return null;
    return { ...winner, percentage: getPercentage(winner.count) };
  };
  const winner = getWinner();

  return (
    <div className='p-4 max-w-3xl mx-auto'>
      {/* Header */}
      <div className='mb-6 text-center'>
        <div className='inline-flex items-center space-x-3 bg-white/80 rounded-full px-6 py-3 shadow-lg'>
          <Vote className='h-6 w-6 text-indigo-600' />
          <h1 className='text-xl font-bold text-gray-800'>
            Live Voting Session
          </h1>
          <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'></div>
        </div>
      </div>

      {/* Voting card */}
      <div className='bg-white p-6 rounded-xl shadow-md'>
        {/* Title and timer */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>
            {latestVote?.title ?? 'No active vote'}
          </h2>
          <div
            className={`flex items-center px-3 py-2 rounded-lg ${timerStatus.bg}`}
          >
            <timerStatus.icon className={`h-5 w-5 ${timerStatus.color}`} />
            <span className={`ml-2 font-medium ${timerStatus.color}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Voting options */}
        {latestVote &&
          !hasVoted &&
          timeLeft !== 'Voting ended' &&
          timeLeft !== 'Voting stopped' && (
            <div className='space-y-3'>
              {latestVote.options.map((option, idx) => {
                const isSelected = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white hover:bg-indigo-50 text-gray-900'
                    } border-indigo-300 transition-colors duration-200`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
          )}

        {/* Vote confirmation */}
        {hasVoted && (
          <div className='mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-semibold'>
            Thanks for voting! You voted for:{' '}
            {latestVote?.options.find((opt) => opt.id === selectedOption)?.text}
          </div>
        )}

        {/* Controls */}
        <div className='flex gap-3 mt-5'>
          {/* Pause/resume */}
          {!isTimerStopped && (
            <button
              onClick={handlePauseToggle}
              className='flex items-center gap-2 px-4 py-2 rounded bg-amber-500 text-white'
            >
              {isTimerPaused ? (
                <Play className='w-5 h-5' />
              ) : (
                <Pause className='w-5 h-5' />
              )}
              {isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
            </button>
          )}

          {/* Stop/Resume Timer */}
          {!isTimerStopped ? (
            <button
              onClick={handleStopTimer}
              className='flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white'
            >
              <StopCircle className='w-5 h-5' /> Stop Voting
            </button>
          ) : (
            <button
              onClick={handleResumeTimer}
              className='flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white'
            >
              <Play className='w-5 h-5' /> Resume Voting
            </button>
          )}

          {/* Show Results */}
          <button
            onClick={() => setShowResults((prev) => !prev)}
            className='flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white'
          >
            <Eye className='w-5 h-5' />{' '}
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>

          {/* Show Detailed Results */}
          <button
            onClick={handleShowDetailedResults}
            className='flex items-center gap-2 px-4 py-2 rounded bg-gray-700 text-white'
          >
            <UserCheck className='w-5 h-5' />{' '}
            {showDetailedResults
              ? 'Hide Detailed Results'
              : 'Show Detailed Results'}
          </button>
        </div>
      </div>

      {/* Voting results */}
      {showResults && latestVote && (
        <div className='mt-8 bg-white p-6 rounded-xl shadow-md'>
          <h3 className='text-xl font-semibold mb-4'>Voting Results</h3>
          {totalVotes === 0 ? (
            <p>No votes have been cast yet.</p>
          ) : (
            <ul className='space-y-3'>
              {latestVote.options.map((option, idx) => (
                <li key={option.id} className='flex flex-col'>
                  <div className='flex justify-between mb-1'>
                    <span className='font-medium'>{option.text}</span>
                    <span>
                      {option.count} votes ({getPercentage(option.count)}%)
                    </span>
                  </div>
                  <div
                    className={`h-4 rounded-full bg-gradient-to-r ${getOptionColor(
                      idx
                    )}`}
                    style={{ width: `${getPercentage(option.count)}%` }}
                  />
                </li>
              ))}
            </ul>
          )}
          {/* Winner info */}
          {winner && (
            <div className='mt-4 p-4 bg-yellow-100 rounded-lg flex items-center gap-3'>
              <Crown className='w-6 h-6 text-yellow-500' />
              <div>
                <p className='font-semibold'>Winner: {winner.text}</p>
                <p>
                  Votes: {winner.count} ({winner.percentage}%)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed voting results */}
      {showDetailedResults && (
        <div className='mt-8 bg-white p-6 rounded-xl shadow-md overflow-x-auto'>
          {/* <h3 className="text-xl font-semibold mb-4">
            Detailed Voting Results
          </h3> */}

          {isLoadingResults && <p>Loading detailed results...</p>}
          {resultsError && (
            <p className='text-red-600'>Error loading detailed results.</p>
          )}

          {voteResults && voteResults.length > 0 ? (
            <table className='w-full table-auto border-collapse border border-gray-300'>
              <thead>
                <tr>
                  <th className='border border-gray-300 px-3 py-2 bg-gray-100'>
                    Voter
                  </th>
                  <th className='border border-gray-300 px-3 py-2 bg-gray-100'>
                    Option Voted
                  </th>
                  <th className='border border-gray-300 px-3 py-2 bg-gray-100'>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {voteResults.map((opt: any) => (
                  <tr key={opt.id || opt._id}>
                    <td className='border border-gray-300 px-3 py-2'>
                      {opt.voterName || opt.voterId || 'Anonymous'}
                    </td>
                    <td className='border border-gray-300 px-3 py-2'>
                      {opt.optionText || opt.text || 'N/A'}
                    </td>
                    <td className='border border-gray-300 px-3 py-2'>
                      {new Date(
                        opt.timestamp || opt.createdAt || ''
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !isLoadingResults && <p>No detailed votes available.</p>
          )}
        </div>
      )}
    </div>
  );
};
