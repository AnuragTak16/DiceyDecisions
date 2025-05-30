import { baseApi, TAGS } from "../store/api";

interface VoteResult {
  voteId: string;
  title: string;
  options: {
    id: string;
    text: string;
    count: number;
  }[];
  totalVotes: number;
  winner: {
    id: string;
    text: string;
    count: number;
  };
  tiebreakerUsed: boolean;
  tiebreakerMethod: "random" | null;
}

const voteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVoteResults: build.query<VoteResult, string>({
      query: (voteId) => ({
        url: `/vote/${voteId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: [TAGS.VOTES],
    }),
  }),
});

export const { useGetVoteResultsQuery } = voteApi;
