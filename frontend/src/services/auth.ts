import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types";
import { AuthState } from "@/types/states";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL + "/auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthState, User>({
      query: (user) => ({
        url: "/login",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: user.username, password: "" }),
      }),
    }),
    logout: builder.mutation<AuthState, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    status: builder.query<AuthState, void>({
      query: () => ({
        url: "/status",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useStatusQuery,
  useLazyStatusQuery,
} = authApi;
