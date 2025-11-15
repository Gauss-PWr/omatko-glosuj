export type LectureRequest = {
  id: number;
};

export type PosterRequest = {
  id: number;
};

export type LectureVoteRequest = {
  merytorykaPoints?: number | null;
  formaPoints?: number | null;
};

export type PosterVoteRequest = {
  merytorykaPoints?: number | null;
  estetykaPoints?: number | null;
};
