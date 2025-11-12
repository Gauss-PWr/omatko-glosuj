import { PosterVotePayload } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PosterVotePayload[] = [];

const slice = createSlice({
  name: "lecturesVotes",
  initialState,
  reducers: {
    setPosterVotes(state, action: PayloadAction<PosterVotePayload[]>) {
      return action.payload;
    },
    setPosterVote(state, action: PayloadAction<PosterVotePayload>) {
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
