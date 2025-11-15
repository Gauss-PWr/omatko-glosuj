import { AllVotes } from "@/types";
import { AllVotesResponse } from "@/types/responses";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const votesApi = createApi({
  reducerPath: "votesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL + "/votes",
    credentials: "include",
  }),
  tagTypes: ["Votes"],
  endpoints: (builder) => ({
    getAllVotes: builder.query<AllVotes, void>({
      query: () => "",
      transformResponse: (response: AllVotesResponse) => {
        return {
          lectures: response.lectures.map((vote) => ({
            id: vote.lecture_id,
            userId: vote.user_id,
            voteId: vote.vote_id,
            vote: {
              merytorykaPoints: vote.merytoryka_points,
              formaPoints: vote.forma_points,
            },
          })),
          posters: response.posters.map((vote) => ({
            id: vote.poster_id,
            vote: {
              merytorykaPoints: vote.merytoryka_points,
              estetykaPoints: vote.estetyka_points,
            },
          })),
          active_users: response.active_users,
        };
      },
    }),
  }),
});

export const { useGetAllVotesQuery } = votesApi;
