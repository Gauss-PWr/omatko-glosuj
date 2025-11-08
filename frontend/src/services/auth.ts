import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState, User } from "@/types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5555",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthState, User>({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: user.username, password: "" }),
      }),
    }),
    logout: builder.mutation<AuthState, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    status: builder.query<AuthState, void>({
      query: () => ({
        url: "/auth/status",
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
