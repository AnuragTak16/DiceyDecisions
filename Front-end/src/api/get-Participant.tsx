import { baseApi, TAGS } from "@/store/api";

export interface Participant {
  name: string;
  userId: string;
  _id: string;
  joinedAt: string;
}

export interface Room {
  name: ReactNode;
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

interface GetParticipantsParams {
  roomCode: string;
}

const getParticipant = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getParticipant: build.query<Room[], GetParticipantsParams>({
      query: ({ roomCode }) => ({
        url: `/roomParticipant/${roomCode}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // params: {
        //   code: roomCode,
        // },
      }),
      providesTags: [TAGS.ROOMS],
    }),
  }),
});

export const { useGetParticipantQuery } = getParticipant;
