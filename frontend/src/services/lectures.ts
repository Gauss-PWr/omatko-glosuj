import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LectureVote } from "@/types";

const LECTURES_API_BASE_URL = "http://localhost:5555/lectures";

export const lecturesApi = createApi({
  reducerPath: "lecturesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: LECTURES_API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getLectures: builder.query<any, void>({
      query: () => `/`,
    }),
    getLectureVotes: builder.query<any, void>({
      query: () => `/votes`,
    }),
    createLectureVote: builder.mutation<any, LectureVote>({
      query: (lectureVote) => ({
        url: `/${lectureVote.lectureId}/vote`,
        method: "POST",
        body: { vote: lectureVote.vote },
      }),
    }),
    updateLectureVote: builder.mutation<any, LectureVote>({
      query: (lectureVote) => ({
        url: `/${lectureVote.lectureId}/vote`,
        method: "PUT",
        body: { vote: lectureVote.vote },
      }),
    }),
  }),
});

export const {
  useGetLecturesQuery,
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
} = lecturesApi;
