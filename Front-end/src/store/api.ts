import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//baseQuery is a function that creates a base query for making HTTP requests.
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
});

export const TAGS = {
  USERS: "User",
} as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});
