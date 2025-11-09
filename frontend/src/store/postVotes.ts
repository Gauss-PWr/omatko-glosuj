import { LectureVote, PosterVote } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PosterVote[] = [];

const slice = createSlice({
  name: "lecturesVotes",
  initialState,
  reducers: {
    setPosterVotes(state, action: PayloadAction<PosterVote[]>) {
      return action.payload;
    },
    setPosterVote(state, action: PayloadAction<PosterVote>) {
      const { posterId, vote } = action.payload;
      const existingVoteIndex = state.findIndex(
        (lv) => lv.posterId === posterId
      );
      if (existingVoteIndex !== -1) {
        state[existingVoteIndex].vote = vote;
      } else {
        state.push({ posterId, vote });
      }
    },
    deletePosterVote(state, action: PayloadAction<{ posterId: number }>) {
      const { posterId } = action.payload;
      return state.filter((lv) => lv.posterId !== posterId);
    },
  },
});

export const { setPosterVotes, setPosterVote, deletePosterVote } =
  slice.actions;
export default slice.reducer;
