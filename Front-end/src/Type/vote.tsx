export interface CreateVotePayload {
  title: string;
  options: string[];
  allowCustomOptions?: boolean;
  duration: {
    days: number;
    hours: number;
    minutes: number;
  };
  roomCode?: string;
}

export interface CastVotePayload {
  voteId: string;
  optionId: string;
}
