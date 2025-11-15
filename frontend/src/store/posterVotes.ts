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
      const { id, vote } = action.payload;
      const existingVoteIndex = state.findIndex(
        (lv) => lv.id === id
      );
      if (existingVoteIndex !== -1) {
        state[existingVoteIndex].vote = vote;
      } else {
        state.push({ id, vote });
      }
    },
    deletePosterVote(state, action: PayloadAction<{ id: number }>) {
      const { id } = action.payload;
      return state.filter((lv) => lv.id !== id);
    },
  },
});

export const { setPosterVotes, setPosterVote, deletePosterVote } =
  slice.actions;
export default slice.reducer;
