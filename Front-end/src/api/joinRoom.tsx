import { baseApi, TAGS } from "../store/api";

export const joinRoom = baseApi.injectEndpoints({
  endpoints: (build) => ({
    joinRoom: build.mutation<unknown, unknown>({
      query: (joinRoomData) => {
        const token = localStorage.getItem("token");
        return {
          url: "/join",
          method: "POST",
          body: joinRoomData,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };
      },
      invalidatesTags: [TAGS.USERS],
    }),
  }),
});

export const { useJoinRoomMutation } = joinRoom;
