/* eslint-disable react-refresh/only-export-components */
//How to write a fetch the signup api

import { baseApi, TAGS } from "../store/api";

export const SignupUser = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signupUser: build.mutation<unknown, unknown>({
      query: (newUser) => ({
        url: "/signup",
        method: "POST",
        body: newUser,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [TAGS.USERS],
    }),
  }),
});

export const { useSignupUserMutation } = SignupUser;
