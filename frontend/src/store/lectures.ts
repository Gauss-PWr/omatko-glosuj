import { LecturesState } from "@/types/states";
import { LectureDay, LectureCategory } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LecturesState = [];

const slice = createSlice({
  name: "lectures",
  initialState,
  reducers: {
    setLectures(state, action: PayloadAction<LecturesState>) {
      return action.payload;
    },
  },
});

export const { setLectures } = slice.actions;
export default slice.reducer;
