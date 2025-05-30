import { baseApi, TAGS } from "../store/api";
interface VoteOption {
  id: string;
  text: string;
  count: number;
}

interface Duration {
  days: number;
  hours: number;
  minutes: number;
}

interface Vote {
  _id: string; // or `id` if you're transforming _id to id
  title: string;
  creatorId: string;
  isOpen: boolean;
  allowCustomOptions: boolean;
  hasEnded: boolean;
  options: VoteOption[];
  votedUsers: string[];
  duration: Duration;
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
}

const getVotingListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVotingList: build.query<Array<Vote>, void>({
      query: () => ({
        url: "/votingList",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: [TAGS.VOTES],
    }),
  }),
});
export const { useGetVotingListQuery } = getVotingListApi;
