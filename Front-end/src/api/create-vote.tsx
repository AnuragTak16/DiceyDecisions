import type { CreateVotePayload } from "@/Type/vote";
import { baseApi, TAGS } from "../store/api";

const voteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createVote: build.mutation<CreateVotePayload, CreateVotePayload>({
      query: (body) => {
        const token = localStorage.getItem("token");
        return {
          url: "/vote",
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };
      },
      invalidatesTags: [TAGS.VOTES],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateVoteMutation } = voteApi;
