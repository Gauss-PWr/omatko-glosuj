import { LectureVote } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LectureVote[] = [];

const slice = createSlice({
  name: "lecturesVotes",
  initialState,
  reducers: {
    setLectureVotes(state, action: PayloadAction<LectureVote[]>) {
      return action.payload;
    },
    setLectureVote(state, action: PayloadAction<LectureVote>) {
      const { lectureId, vote } = action.payload;
      const existingVoteIndex = state.findIndex(
        (lv) => lv.lectureId === lectureId
      );
      if (existingVoteIndex !== -1) {
        state[existingVoteIndex].vote = vote;
      } else {
        state.push({ lectureId, vote });
      }
    },
    deleteLectureVote(state, action: PayloadAction<{ lectureId: number }>) {
      const { lectureId } = action.payload;
      return state.filter((lv) => lv.lectureId !== lectureId);
    },
  },
});

export const { setLectureVotes, setLectureVote, deleteLectureVote } =
  slice.actions;
export default slice.reducer;
