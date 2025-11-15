import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Poster, PosterVotePayload } from "../types";
import { PosterVoteResponse, PosterResponse } from "@/types/responses";
import { Meta } from "react-router";

const mapVoteToBody = (posterVote: PosterVotePayload) => ({
  merytoryka_points: posterVote.vote.merytorykaPoints,
  estetyka_points: posterVote.vote.estetykaPoints,
});

export const postersApi = createApi({
  reducerPath: "postersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL + "/posters",
    credentials: "include",
  }),
  tagTypes: ["Posters"],
  endpoints: (builder) => ({
    getPosters: builder.query<Poster[], void>({
      query: () => "",
      transformResponse: (response: PosterResponse[]) => {
        return response.map((poster) => ({
          id: poster.poster_id,
          posterName: poster.poster_name,
          posterAuthor: poster.poster_author,
          posterDescription: poster.poster_description,
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((poster) => ({
                type: "Posters" as const,
                id: poster.id,
              })),
              { type: "Posters", id: "LIST" },
            ]
          : [{ type: "Posters", id: "LIST" }],
    }),
    getPosterVotes: builder.query<PosterVotePayload[], void>({
      query: () => `/votes`,
      transformResponse: (response: PosterVoteResponse[]) => {
        return response.map((vote) => ({
          id: vote.poster_id,
          vote: {
            merytorykaPoints: vote.merytoryka_points,
            estetykaPoints: vote.estetyka_points,
          },
        }));
      },
    }),
    createPosterVote: builder.mutation<any, PosterVotePayload>({
      query: (posterVote) => ({
        url: `/${posterVote.id}/vote`,
        method: "POST",
        body: { vote_request: mapVoteToBody(posterVote) },
      }),
    }),
    updatePosterVote: builder.mutation<any, PosterVotePayload>({
      query: (posterVote) => ({
        url: `/${posterVote.id}/vote`,
        method: "PUT",
        body: { vote_request: mapVoteToBody(posterVote) },
      }),
    }),
    deletePosterVote: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}/vote`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPostersQuery,
  useGetPosterVotesQuery,
  useCreatePosterVoteMutation,
  useUpdatePosterVoteMutation,
  useDeletePosterVoteMutation,
} = postersApi;
