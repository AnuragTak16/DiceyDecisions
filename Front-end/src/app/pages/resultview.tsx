import { Dice1, RotateCcw, Coins, Trophy } from "lucide-react";
import { useState } from "react";

export const ResultsView = () => {
  const [tiebreakerResult, setTiebreakerResult] = useState<{
    option: string;
    votes: number;
  } | null>(null);
  const [showTiebreaker, setShowTiebreaker] = useState(false);

  const results = [
    { option: "Dominos", votes: 3 },
    { option: "Subway", votes: 3 },
    { option: "Cook at home", votes: 1 },
  ];

  const maxVotes = Math.max(...results.map((r) => r.votes));
  const winners = results.filter((r) => r.votes === maxVotes);
  const hasTie = winners.length > 1;

  const handleTiebreaker = () => {
    setShowTiebreaker(true);
    setTimeout(() => {
      const randomWinner = winners[Math.floor(Math.random() * winners.length)];
      setTiebreakerResult(randomWinner);
      setShowTiebreaker(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Results</h2>
        <p className="text-gray-600">Room Title Placeholder</p>
      </div>

      <div className="space-y-4 mb-8">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{result.option}</span>
                <span className="text-gray-600">{result.votes} votes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(result.votes / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasTie && !tiebreakerResult && (
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-orange-600">
            It's a tie! Choose a tiebreaker:
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleTiebreaker()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <Dice1 size={20} />
              <span>Dice Roll</span>
            </button>
            <button
              onClick={() => handleTiebreaker()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <RotateCcw size={20} />
              <span>Spinner</span>
            </button>
            <button
              onClick={() => handleTiebreaker()}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <Coins size={20} />
              <span>Coin Flip</span>
            </button>
          </div>
        </div>
      )}

      {showTiebreaker && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Breaking the tie...</p>
        </div>
      )}

      {tiebreakerResult && (
        <div className="text-center py-8 bg-green-50 rounded-lg">
          <Trophy size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">Winner!</h3>
          <p className="text-xl">{tiebreakerResult.option}</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCurrentView("home")}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
