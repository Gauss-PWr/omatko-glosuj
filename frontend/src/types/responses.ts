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

export type LectureVoteResponse = {
  lecture_id: number;
  user_id?: number;
  vote_id?: number;
  merytoryka_points: number | null;
  forma_points: number | null;
};

export type PosterVoteResponse = {
  poster_id: number;
  merytoryka_points: number | null;
  estetyka_points: number | null;
};

export type AllVotesResponse = {
  lectures: LectureVoteResponse[];
  posters: PosterVoteResponse[];
  active_users: number;
};
