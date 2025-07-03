import { baseApi, TAGS } from '@/store/api';

// Define the type for the query parameters
type GetParticipantsParams = {
  roomCode: string;
};

const getParticipant = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getParticipant: build.query<string[], GetParticipantsParams>({
      query: ({ roomCode }) => ({
        url: `/room/${roomCode}/participants`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      transformResponse: (response: { participantNames: string[] }) =>
        response.participantNames,

      providesTags: [TAGS.ROOMS],
    }),
  }),
});

export const { useGetParticipantQuery } = getParticipant;
