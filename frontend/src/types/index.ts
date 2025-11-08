export type User = {
  username: string;
};
export type AuthState = {
  authenticated: boolean;
};

export type Lecture = {
  lectureId: number;
  lectureCategory: string;
  lectureName: string;
  speakerName: string;
  lectureDatetime: string;
  lectureDescription: string;
};

export type Poster = {
  posterId: number;
  posterName: string;
  posterAuthor: string;
};

export type LectureRequest = {
  lectureId: number;
};

export type PosterRequest = {
  posterId: number;
};

export type VoteLectureRequest = {
  merytorykaPoints?: number | null;
  formaPoints?: number | null;
};

export type VotePosterRequest = {
  merytorykaPoints?: number | null;
  estetykaPoints?: number | null;
};

export enum LectureDay {
  DAY_1 = "2025-12-05",
  DAY_2 = "2025-12-06",
  DAY_3 = "2025-12-07",
}

export enum LectureType {
  STOSOWNA = "stosowna",
  TEORETYCZNA = "teoretyczna",
}

export type LecturesState = {
  [key in LectureDay]: {
    [key in LectureType]: Lecture[];
  };
};

export type PostersState = Poster[];

export type LectureVote = {
  lectureId: number;
  vote: VoteLectureRequest;
};

export type PosterVote = {
  posterId: number;
  vote: VotePosterRequest;
};

export type LectureVotesState = LectureVote[];

export type PosterVotesState = PosterVote[];
