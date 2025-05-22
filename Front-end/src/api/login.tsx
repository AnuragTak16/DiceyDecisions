import { baseApi, TAGS } from "../store/api";

export const SigninUser = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signinUser: build.mutation<unknown, unknown>({
      query: (newUser) => ({
        url: "/login",
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

export const { useSigninUserMutation } = SigninUser;
