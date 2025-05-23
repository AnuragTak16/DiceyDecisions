import { baseApi, TAGS } from "../store/api";
export interface Participant {
  name: string;
  userId: string;
  _id: string;
  joinedAt: string;
}

export interface Room {
  _id: string;
  title: string;
  description: string;
  maxParticipants: number;
  creatorId: {
    _id: string;
    userName: string;
    email: string;
  };
  roomCode: string;
  inviteLink: string;
  isOpen: boolean;
  createdAt: string;
  participants: Participant[];
}

//RoomDetails used Api
const RoomDetail = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoomDetail: build.query<Room[], void>({
      query: () => ({
        url: "/roomDetails",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: [TAGS.ROOMS],
    }),
  }),
});

export const { useGetRoomDetailQuery } = RoomDetail;
