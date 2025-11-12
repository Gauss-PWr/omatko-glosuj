import { PostersState } from "@/types/states";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PostersState = [];

const slice = createSlice({
  name: "posters",
  initialState,
  reducers: {
    setPosters(state, action: PayloadAction<PostersState>) {
      return action.payload;
    },
  },
});

export const { setPosters } = slice.actions;
export default slice.reducer;
