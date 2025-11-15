import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { LectureVotePayload } from "@/types";
import { RootState } from "@/store";

const adapter = createEntityAdapter<LectureVotePayload>({});

const slice = createSlice({
  name: "lectureVotes",
  initialState: adapter.getInitialState(),
  reducers: {
    setLectureVotes(state, action: PayloadAction<LectureVotePayload[]>) {
      adapter.setAll(state, action.payload);
    },
    setLectureVote(state, action: PayloadAction<LectureVotePayload>) {
      adapter.upsertOne(state, action.payload);
    },
    deleteLectureVote(state, action: PayloadAction<{ id: number }>) {
      adapter.removeOne(state, action.payload.id);
    },
  },
});

export const { setLectureVotes, setLectureVote, deleteLectureVote } =
  slice.actions;
export const lectureVotesSelectors = adapter.getSelectors<RootState>(
  (state) => state.lectureVotes
);
export default slice.reducer;
