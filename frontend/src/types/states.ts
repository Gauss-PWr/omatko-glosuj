import { Poster, Lecture, LectureVotePayload } from ".";

export type LecturesState = Lecture[];

export type PostersState = Poster[];

export type LectureVotesState = LectureVotePayload[];

export type AuthState = {
  authenticated: boolean;
  is_admin?: boolean;
};
