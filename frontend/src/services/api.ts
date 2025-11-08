import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState, User } from '@/types'

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5555", credentials: "include" }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthState, User>({
            query: (user) => ({
                url: "/auth/login",
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username: user.username, password: "" })
            }),
        }),
        logout: builder.mutation<AuthState, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        })

    })

})

export const { useLoginMutation, useLogoutMutation } = api;