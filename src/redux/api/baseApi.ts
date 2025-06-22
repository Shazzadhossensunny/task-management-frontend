import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import type { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";

// Define error response type
interface ErrorResponse {
  message: string;
  statusCode?: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle error responses
  if (result?.error) {
    const errorData = result.error.data as ErrorResponse;
    const status = result.error.status;

    switch (status) {
      case 400:
        toast.error(errorData.message || "Bad Request");
        break;
      case 401:
        // Try refreshing token
        try {
          const res = await fetch(
            "http://localhost:5000/api/auth/refresh-token",
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (res.ok) {
            const refreshData = await res.json();

            if (refreshData.success && refreshData.data?.accessToken) {
              const currentState = api.getState() as RootState;
              const currentUser = currentState?.auth?.user;

              if (currentUser) {
                api.dispatch(
                  setUser({
                    user: currentUser, // ✅ safe because we checked for null
                    token: refreshData.data.accessToken,
                  })
                );

                // Retry the original request with new token
                result = await baseQuery(args, api, extraOptions);
              } else {
                toast.error("User information missing. Please login again.");
                api.dispatch(logout());
              }
            } else {
              toast.error("Session expired. Please login again.");
              api.dispatch(logout());
            }
          } else {
            toast.error("Session expired. Please login again.");
            api.dispatch(logout());
          }
        } catch (error) {
          toast.error("Authentication failed. Please login again.");
          api.dispatch(logout());
        }
        break;
      case 403:
        toast.error(errorData.message || "Access Forbidden");
        break;
      case 404:
        toast.error(errorData.message || "Resource not found");
        break;
      case 500:
        toast.error("Internal server error. Please try again later.");
        break;
      default:
        toast.error(errorData.message || "An error occurred");
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["User", "Task"],
  endpoints: () => ({}),
});
