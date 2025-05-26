import { baseApi } from "@/store/api";

interface JoinWithLinkResponse {
  message: string;
  room: {
    _id: string;
    title: string;
    // Add more fields as needed
  };
}

export const joinWithLinkApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    joinWithLink: build.mutation<JoinWithLinkResponse, string>({
      query: (roomCode) => ({
        url: `/room/join-from-link/${roomCode}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
  }),
});

export const { useJoinWithLinkMutation } = joinWithLinkApi;
