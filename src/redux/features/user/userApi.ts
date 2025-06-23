import { baseApi } from "../../api/baseApi";
import type { RegisterRequest, RegisterResponse } from "../auth/authApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleUserProfile: builder.query({
      query: () => ({
        url: `/users/profile`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: `/users/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useRegisterUserMutation, useGetSingleUserProfileQuery } =
  userApi;
