import { LecturesState } from "@/types";
import { LectureDay, LectureType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LectureVotesState } from "@/types";

const initialState: LectureVotesState = [];

const slice = createSlice({
  name: "lecturesVotes",
  initialState,
  reducers: {
    setLectureVotes(state, action: PayloadAction<LectureVotesState>) {
      state = action.payload;
    },
  },
});

export const { setLectureVotes } = slice.actions;
export default slice.reducer;
