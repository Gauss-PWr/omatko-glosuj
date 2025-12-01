import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Lecture, LectureVotePayload } from "@/types";
import { LectureResponse, LectureVoteResponse } from "@/types/responses";

const mapVoteToBody = (lectureVote: LectureVotePayload) => ({
  merytoryka_points: lectureVote.vote.merytorykaPoints,
  forma_points: lectureVote.vote.formaPoints,
});

export const lecturesApi = createApi({
  reducerPath: "lecturesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL + "/lectures",
    credentials: "include",
  }),
  tagTypes: ["Lectures", "LectureVotes"],
  endpoints: (builder) => ({
    getLectures: builder.query<Lecture[], void>({
      query: () => "",
      transformResponse: (response: LectureResponse[]) => {
        return response.map((lecture) => ({
          id: lecture.lecture_id,
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
                id: lecture.id,
              })),
              { type: "Lectures", id: "LIST" },
            ]
          : [{ type: "Lectures", id: "LIST" }],
    }),
    getLectureVotes: builder.query<LectureVotePayload[], void>({
      query: () => `/votes`,
      transformResponse: (response: LectureVoteResponse[]) => {
        return response.map((vote) => ({
          id: vote.lecture_id,
          vote: {
            merytorykaPoints: vote.merytoryka_points,
            formaPoints: vote.forma_points,
          },
        }));
      },
      providesTags: (result) =>
        result
          ? result.map((v) => ({ type: "LectureVotes" as const, id: v.id }))
          : [],
    }),
    createLectureVote: builder.mutation<any, LectureVotePayload>({
      query: (lectureVote) => ({
        url: `/${lectureVote.id}/vote`,
        method: "POST",
        body: { vote_request: mapVoteToBody(lectureVote) },
      }),
      async onQueryStarted(lectureVote, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          lecturesApi.util.updateQueryData(
            "getLectureVotes",
            undefined,
            (draft) => {
              if (!draft) {
                return [lectureVote];
              }
              const existingIndex = draft.findIndex(
                (vote) => vote.id === lectureVote.id
              );
              if (existingIndex >= 0) {
                draft[existingIndex] = lectureVote;
              } else {
                draft.push(lectureVote);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    updateLectureVote: builder.mutation<any, LectureVotePayload>({
      query: (lectureVote) => ({
        url: `/${lectureVote.id}/vote`,
        method: "PUT",
        body: { vote_request: mapVoteToBody(lectureVote) },
      }),
      async onQueryStarted(lectureVote, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          lecturesApi.util.updateQueryData(
            "getLectureVotes",
            undefined,
            (draft) => {
              if (!draft) {
                return [lectureVote];
              }
              const index = draft.findIndex(
                (vote) => vote.id === lectureVote.id
              );
              if (index >= 0) {
                draft[index] = lectureVote;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    deleteLectureVote: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}/vote`,
        method: "DELETE",
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          lecturesApi.util.updateQueryData(
            "getLectureVotes",
            undefined,
            (draft) => {
              if (!draft) {
                return;
              }
              const index = draft.findIndex((vote) => vote.id === id);
              if (index >= 0) {
                draft.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
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
