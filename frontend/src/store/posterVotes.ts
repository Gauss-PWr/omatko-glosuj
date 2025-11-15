import { PosterVotePayload } from "@/types";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/store";

const adapter = createEntityAdapter<PosterVotePayload>({});

const slice = createSlice({
  name: "posterVotes",
  initialState: adapter.getInitialState(),
  reducers: {
    setPosterVotes(state, action: PayloadAction<PosterVotePayload[]>) {
      adapter.setAll(state, action.payload);
    },
    setPosterVote(state, action: PayloadAction<PosterVotePayload>) {
      adapter.upsertOne(state, action.payload);
    },
    deletePosterVote(state, action: PayloadAction<{ id: number }>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
  },
});

export const { setPosterVotes, setPosterVote, deletePosterVote } =
  slice.actions;
export const posterVotesSelectors = adapter.getSelectors<RootState>(
  (state) => state.posterVotes
);
export default slice.reducer;
