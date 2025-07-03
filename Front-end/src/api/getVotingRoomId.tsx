import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const votingApi = createApi({
  reducerPath: 'votingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getVotingRoomById: builder.query({
      query: (id) => `voting-room/${id}`,
    }),
  }),
});

export const { useLazyGetVotingRoomByIdQuery } = votingApi;
