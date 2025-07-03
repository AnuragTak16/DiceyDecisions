import { baseApi, TAGS } from "@/store/api";

export interface PollOption {
  id: string;
  text: string;
  count: number;
  _id: string;
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
  startTime: string;
  endTime: string;
}

export interface Poll {
  _id: string;
  title: string;
  creatorId: string;
  allowCustomOptions: boolean;
  options: PollOption[];
  votedUsers: string[];
  duration: Duration;
  createdAt: string;
  updatedAt: string;
}

interface GetPollsParams {
  creatorId: string;
}

const pollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPollsByCreator: build.query<Poll[], GetPollsParams>({
      query: ({ creatorId }) => ({
        url: `/polls/byCreator/${creatorId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: [TAGS.POLLS],
    }),
  }),
});

export const { useGetPollsByCreatorQuery } = pollApi;
