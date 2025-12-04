import { postersApi } from '@/services/posters';
import { lecturesApi } from '@/services/lectures';
import type { AppDispatch, RootState } from '@/store';
import type { PosterVotePayload, LectureVotePayload } from '@/types';

const POSTER_VOTES_KEY = 'rtk-cache-poster-votes';
const LECTURE_VOTES_KEY = 'rtk-cache-lecture-votes';

/**
 * Save poster votes to localStorage
 */
export function persistPosterVotes(votes: PosterVotePayload[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(POSTER_VOTES_KEY, JSON.stringify(votes));
  } catch {
    // swallow errors (quota exceeded or unsupported)
  }
}

/**
 * Save lecture votes to localStorage
 */
export function persistLectureVotes(votes: LectureVotePayload[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LECTURE_VOTES_KEY, JSON.stringify(votes));
  } catch {
    // swallow errors (quota exceeded or unsupported)
  }
}

/**
 * Rehydrate poster votes from localStorage into RTK Query cache
 */
export function rehydratePosterVotes(dispatch: AppDispatch) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(POSTER_VOTES_KEY);
    if (!stored) return;
    const data: PosterVotePayload[] = JSON.parse(stored);
    dispatch(
      postersApi.util.updateQueryData('getPosterVotes', undefined, () => data)
    );
  } catch {
    // swallow errors (invalid JSON or unsupported)
  }
}

/**
 * Rehydrate lecture votes from localStorage into RTK Query cache
 */
export function rehydrateLectureVotes(dispatch: AppDispatch) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(LECTURE_VOTES_KEY);
    if (!stored) return;
    const data: LectureVotePayload[] = JSON.parse(stored);
    dispatch(
      lecturesApi.util.updateQueryData('getLectureVotes', undefined, () => data)
    );
  } catch {
    // swallow errors (invalid JSON or unsupported)
  }
}

/**
 * Rehydrate all votes caches from localStorage
 */
export function rehydrateVotesCache(dispatch: AppDispatch) {
  rehydratePosterVotes(dispatch);
  rehydrateLectureVotes(dispatch);
}

// Selectors for accessing cached vote data
const selectPosterVotes = postersApi.endpoints.getPosterVotes.select(undefined);
const selectLectureVotes = lecturesApi.endpoints.getLectureVotes.select(undefined);

/**
 * Subscribe to store changes and persist votes when they change
 */
export function setupVotesPersistence(
  store: { getState: () => RootState; subscribe: (listener: () => void) => () => void }
) {
  let prevPosterVotesJson = '';
  let prevLectureVotesJson = '';

  return store.subscribe(() => {
    const state = store.getState();

    // Check poster votes using RTK Query selector
    const posterVotesResult = selectPosterVotes(state);
    const posterVotesData = posterVotesResult?.data;
    if (posterVotesData) {
      const json = JSON.stringify(posterVotesData);
      if (json !== prevPosterVotesJson) {
        prevPosterVotesJson = json;
        persistPosterVotes(posterVotesData);
      }
    }

    // Check lecture votes using RTK Query selector
    const lectureVotesResult = selectLectureVotes(state);
    const lectureVotesData = lectureVotesResult?.data;
    if (lectureVotesData) {
      const json = JSON.stringify(lectureVotesData);
      if (json !== prevLectureVotesJson) {
        prevLectureVotesJson = json;
        persistLectureVotes(lectureVotesData);
      }
    }
  });
}
