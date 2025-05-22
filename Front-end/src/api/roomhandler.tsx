import { baseApi, TAGS } from "../store/api";

export const createRoom = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createRoom: build.mutation<unknown, unknown>({
      query: (roomData) => {
        const token = localStorage.getItem("token");
        return {
          url: "/room",
          method: "POST",
          body: roomData,
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

export const { useCreateRoomMutation } = createRoom;
