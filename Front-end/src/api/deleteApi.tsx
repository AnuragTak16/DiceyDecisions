import { baseApi, TAGS } from "../store/api";

const roomApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    deleteRoom: build.mutation<{ message: string }, string>({
      query: (roomId) => ({
        url: `/rooms/${roomId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: [TAGS.ROOMS], // invalidate rooms cache if you have it
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteRoomMutation } = roomApi;
