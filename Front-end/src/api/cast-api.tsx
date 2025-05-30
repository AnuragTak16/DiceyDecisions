import { baseApi, TAGS } from "../store/api";
interface CastVotePayload {
  voteId: string;
  optionId?: string;
  customOptionText?: string;
}

const castApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    castVote: build.mutation<unknown, CastVotePayload>({
      query: ({ voteId, optionId, customOptionText }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/vote/${voteId}/cast`,
          method: "POST",
          body: optionId
            ? { optionId }
            : customOptionText
              ? { customOptionText }
              : {},
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

export const { useCastVoteMutation } = castApi;
