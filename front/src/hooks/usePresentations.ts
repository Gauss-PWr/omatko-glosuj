import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Base selectors
const selectLecturesState = (state: RootState) => state.presentations.lectures;
const selectPostersState = (state: RootState) => state.presentations.posters;

// Memoized selectors
export const selectAllLectures = createSelector(
  [selectLecturesState],
  (lectures) => Object.values(lectures)
);

export const selectAllPosters = createSelector(
  [selectPostersState],
  (posters) => Object.values(posters)
);

// Hooks
export const useLectures = (): Presentation[] => {
  return useSelector(selectAllLectures);
};

export const usePosters = (): Presentation[] => {
  return useSelector(selectAllPosters);
};

// Optional: Individual item selectors
export const selectLectureById = createSelector(
  [selectLecturesState, (_: RootState, id: number) => id],
  (lectures, id) => lectures[id]
);

export const useLecture = (id: number): Presentation | undefined => {
  return useSelector((state) => selectLectureById(state, id));
};