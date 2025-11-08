import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Lecture,
  LectureResponse,
  LectureVote,
  LectureVoteResponse,
} from "@/types";

const LECTURES_API_BASE_URL = "http://localhost:5555/lectures";

const mapVoteToBody = (lectureVote: LectureVote) => ({
  merytoryka_points: lectureVote.vote.merytorykaPoints,
  forma_points: lectureVote.vote.formaPoints,
});

export const lecturesApi = createApi({
  reducerPath: "lecturesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: LECTURES_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Lectures"],
  endpoints: (builder) => ({
    getLectures: builder.query<Lecture[], void>({
      query: () => `/`,
      transformResponse: (response: LectureResponse[]) => {
        return response.map((lecture) => ({
          lectureId: lecture.lecture_id,
          lectureCategory: lecture.lecture_category,
          lectureName: lecture.lecture_name,
          speakerName: lecture.speaker_name,
          lectureDatetime: lecture.lecture_datetime,
          lectureDescription: lecture.lecture_description,
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((lecture) => ({
                type: "Lectures" as const,
                id: lecture.lectureId,
              })),
              { type: "Lectures", id: "LIST" },
            ]
          : [{ type: "Lectures", id: "LIST" }],
    }),
    getLectureVotes: builder.query<LectureVote[], void>({
      query: () => `/votes`,
      transformResponse: (response: LectureVoteResponse[]) => {
        return response.map((vote) => ({
          lectureId: vote.lecture_id,
          vote: {
            merytorykaPoints: vote.merytoryka_points,
            formaPoints: vote.forma_points,
          },
        }));
      },
    }),
    createLectureVote: builder.mutation<any, LectureVote>({
      query: (lectureVote) => ({
        url: `/${lectureVote.lectureId}/vote`,
        method: "POST",
        body: mapVoteToBody(lectureVote),
      }),
    }),
    updateLectureVote: builder.mutation<any, LectureVote>({
      query: (lectureVote) => ({
        url: `/${lectureVote.lectureId}/vote`,
        method: "PUT",
        body: mapVoteToBody(lectureVote),
      }),
    }),
    deleteLectureVote: builder.mutation<any, { lectureId: number }>({
      query: ({ lectureId }) => ({
        url: `/${lectureId}/vote`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetLecturesQuery,
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
  useDeleteLectureVoteMutation,
} = lecturesApi;
