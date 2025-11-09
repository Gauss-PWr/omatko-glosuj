import { LecturesState } from "@/types";
import { LectureDay, LectureType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LecturesState = {
  [LectureDay.DAY_1]: {
    [LectureType.STOSOWANA]: [],
    [LectureType.TEORETYCZNA]: [],
  },
  [LectureDay.DAY_2]: {
    [LectureType.STOSOWANA]: [],
    [LectureType.TEORETYCZNA]: [],
  },
  [LectureDay.DAY_3]: {
    [LectureType.STOSOWANA]: [],
    [LectureType.TEORETYCZNA]: [],
  },
};

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
