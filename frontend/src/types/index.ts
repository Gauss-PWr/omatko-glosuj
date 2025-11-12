import { LectureVoteRequest, PosterVoteRequest } from "./requestes";
import { AuthState } from "./states";

export type User = {
  username: string;
};

export type Lecture = {
  lectureId: number;
  lectureCategory: "stosowana" | "teoretyczna";
  lectureName: string;
  speakerName: string;
  lectureDatetime: string;
  lectureDescription: string;
};

export type Poster = {
  posterId: number;
  posterName: string;
  posterAuthor: string;
  posterDescription: string;
};

export enum LectureDay { // hardcoded - do something better later
  DAY_1 = "2025-12-05",
  DAY_2 = "2025-12-06",
  DAY_3 = "2025-12-07",
}

export enum LectureCategory {
  STOSOWANA = "stosowana",
  TEORETYCZNA = "teoretyczna",
}

export type LectureVotePayload = {
  lectureId: number;
  vote: LectureVoteRequest;
};

export type PosterVotePayload = {
  posterId: number;
  vote: PosterVoteRequest;
};

export type AuthPayload = AuthState;

export type AllVotes = {
  lectures: LectureVotePayloadExtended[];
  posters: PosterVotePayload[];
  active_users: number;
};

export type LectureVotePayloadExtended = LectureVotePayload & {
  userId: number;
  voteId: number;
};

export type MappedLectures = {
  [key in LectureDay]: {
    [key in LectureCategory]: Lecture[];
  };
};

export type LectureScore = {
  lectureName: string;
  speakerName: string;
  score: number;
  votes: number;
};

export type PosterScore = {
  posterName: string;
  posterAuthor: string;
  score: number;
  votes: number;
};
