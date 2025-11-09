export type User = {
  username: string;
};
export type AuthState = {
  authenticated: boolean;
};

export type Lecture = {
  lectureId: number;
  lectureCategory: "stosowana" | "teoretyczna";
  lectureName: string;
  speakerName: string;
  lectureDatetime: string;
  lectureDescription: string;
};

export type LectureResponse = {
  lecture_id: number;
  lecture_category: "stosowana" | "teoretyczna";
  lecture_name: string;
  speaker_name: string;
  lecture_datetime: string;
  lecture_description: string;
};

export type PosterResponse = {
  poster_id: number;
  poster_name: string;
  poster_author: string;
  poster_description: string;
};

export type Poster = {
  posterId: number;
  posterName: string;
  posterAuthor: string;
  posterDescription: string;
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

export type VoteLectureResponse = {
  lecture_id: number;
  merytoryka_points: number | null;
  forma_points: number | null;
};

export type VotePosterRequest = {
  merytorykaPoints?: number | null;
  estetykaPoints?: number | null;
};
export type VotePosterResponse = {
  poster_id: number;
  merytoryka_points: number | null;
  estetyka_points: number | null;
};

export enum LectureDay {
  DAY_1 = "2025-12-05",
  DAY_2 = "2025-12-06",
  DAY_3 = "2025-12-07",
}

export enum LectureType {
  STOSOWANA = "stosowana",
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

export type LectureVoteResponse = {
  lecture_id: number;
  merytoryka_points: number | null;
  forma_points: number | null;
};

export type PosterVoteResponse = {
  poster_id: number;
  merytoryka_points: number | null;
  estetyka_points: number | null;
};

export type LectureVotesState = LectureVote[];

export type PosterVotesState = PosterVote[];
