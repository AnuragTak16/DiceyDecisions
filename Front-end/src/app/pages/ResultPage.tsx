import { useGetVoteResultsQuery } from "@/api/get-result";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VotingResultProps {
  voteId: string;
}

export const VotingResults = ({ voteId }: VotingResultProps) => {
  const { data, isLoading, error } = useGetVoteResultsQuery(voteId);

  if (isLoading)
    return <div className="text-center mt-4">Loading results...</div>;

  if (error)
    return (
      <div className="text-center mt-4 text-red-500">
        Failed to load results.
      </div>
    );

  if (!data) return null;

  const {
    title,
    options,
    totalVotes,
    winner,
    tiebreakerUsed,
    tiebreakerMethod,
  } = data;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>

        <div className="space-y-4">
          {options.map((option) => {
            const percentage = totalVotes
              ? (option.count / totalVotes) * 100
              : 0;
            return (
              <div key={option.id}>
                <div className="flex justify-between mb-1">
                  <span>{option.text}</span>
                  <span>
                    {option.count} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <motion.div
                    className={cn(
                      "h-4 rounded-full",
                      winner.id === option.id ? "bg-green-500" : "bg-blue-400"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center font-bold text-lg">
          🎉 Final Winner: <span className="text-green-600">{winner.text}</span>
        </div>

        {tiebreakerUsed && (
          <div className="mt-2 text-center text-sm text-gray-600">
            Tiebreaker applied using <strong>{tiebreakerMethod}</strong>.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
