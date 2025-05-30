import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//baseQuery is a function that creates a base query for making HTTP requests.
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    console.log("Auth Token:", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const TAGS = {
  USERS: "User",
  ROOMS: "Room",
  VOTES: "Vote",
} as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});
