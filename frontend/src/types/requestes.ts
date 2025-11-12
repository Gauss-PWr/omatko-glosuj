export type LectureRequest = {
  lectureId: number;
};

export type PosterRequest = {
  posterId: number;
};

export type LectureVoteRequest = {
  merytorykaPoints?: number | null;
  formaPoints?: number | null;
};

export type PosterVoteRequest = {
  merytorykaPoints?: number | null;
  estetykaPoints?: number | null;
};
