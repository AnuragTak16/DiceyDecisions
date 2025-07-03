import { baseApi, TAGS } from "../store/api";

interface Option {
  id: string;
  text: string;
  count: number;
}

interface VoteResultResponse {
  voteId: string;
  title: string;
  options: Option[];
  totalVotes: number;
  winner: Option;
  tiebreakerUsed: boolean;
  tiebreakerMethod: "random" | null;
}

const voteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVoteResults: build.query<Option[], string>({
      query: (voteId) => `/result/${voteId}`,
      transformResponse: (response: VoteResultResponse) => response.options,
      providesTags: (result, error, voteId) => [
        { type: TAGS.VOTES, id: voteId },
      ],
    }),
  }),
});

export const { useGetVoteResultsQuery } = voteApi;
