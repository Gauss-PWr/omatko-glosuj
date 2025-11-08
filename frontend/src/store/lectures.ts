import { LecturesState } from "@/types";
import { LectureDay, LectureType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LecturesState = {
  [LectureDay.DAY_1]: {
    [LectureType.STOSOWNA]: [],
    [LectureType.TEORETYCZNA]: [],
  },
  [LectureDay.DAY_2]: {
    [LectureType.STOSOWNA]: [],
    [LectureType.TEORETYCZNA]: [],
  },
  [LectureDay.DAY_3]: {
    [LectureType.STOSOWNA]: [],
    [LectureType.TEORETYCZNA]: [],
  },
};

const slice = createSlice({
  name: "lectures",
  initialState,
  reducers: {
    setLectures(
      state,
      action: PayloadAction<{
        day: LectureDay;
        type: LectureType;
        lectures: LecturesState[LectureDay][LectureType];
      }>
    ) {
      const { day, type, lectures } = action.payload;
      state[day][type] = lectures;
    },
  },
});

export const { setLectures } = slice.actions;
export default slice.reducer;
