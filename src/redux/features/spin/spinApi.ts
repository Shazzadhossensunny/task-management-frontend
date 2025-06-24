import { baseApi } from "../../api/baseApi";

const spinApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    spinWheel: builder.mutation({
      query: (data) => ({
        url: `/spin`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSpinWheelMutation } = spinApi;
