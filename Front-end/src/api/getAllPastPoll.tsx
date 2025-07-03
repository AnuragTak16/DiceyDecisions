import { baseApi, TAGS } from "@/store/api";

export const pollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPastPolls: build.query<any, { creatorId: string }>({
      query: ({ creatorId }) => ({
        url: `/polls?creatorId=${creatorId}&status=past`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: [TAGS.POLLS],
    }),
  }),
});

export const { useGetAllPastPollsQuery } = pollApi;
