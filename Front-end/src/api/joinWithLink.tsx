import { baseApi } from "@/store/api";

export const joinWithLinkApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    joinWithLink: build.mutation<unknown, string>({
      query: (roomCode) => ({
        url: `/room/join-from-link/${roomCode}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useJoinWithLinkMutation } = joinWithLinkApi;
