import type { TResponseRedux } from "../../../type/global.type";
import { baseApi } from "../../api/baseApi";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query({
      query: () => ({
        url: `/tasks`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: `/tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    getTaskById: builder.query({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "GET",
        providesTags: ["Task"],
      }),
      transformResponse: (response: TResponseRedux<any>) => response.data,
      providesTags: ["Task"],
    }),
    updateTaskById: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: TResponseRedux<any>) => response.data,
      invalidatesTags: ["Task"],
    }),
    // updateTaskStatus: builder.mutation({
    //   query: ({ id, ...body }) => ({

    //     url: `/tasks/${id}/status`,
    //     method: "PATCH",
    //     body,
    //   }),
    //   transformResponse: (response: TResponseRedux<any>) => response.data,
    //   invalidatesTags: ["Task"],
    // }),
    updateTaskStatus: builder.mutation({
      query: ({ id, ...status }) => {
        console.log("RTK Query - ID:", id);
        console.log("RTK Query - Body:", status);
        return {
          url: `/tasks/${id}/status`,
          method: "PATCH",
          body: status, // This should only contain { status, points? }
        };
      },
      invalidatesTags: ["Task"],
    }),
    deleteTaskById: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: TResponseRedux<any>) => response.data,
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskByIdMutation,
  useDeleteTaskByIdMutation,
  useUpdateTaskStatusMutation,
} = taskApi;
