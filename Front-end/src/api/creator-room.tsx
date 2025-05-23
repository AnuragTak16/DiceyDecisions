import { baseApi, TAGS } from "../store/api";

//RoomCreator used Api
const RoomCreator = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCreatedRooms: build.query<unknown[], void>({
      query: () => ({
        url: "/creatorRoom",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: [TAGS.ROOMS],
    }),
  }),
});

export const { useGetCreatedRoomsQuery } = RoomCreator;
