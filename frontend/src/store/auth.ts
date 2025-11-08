import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/types";

const initialState: AuthState = { authenticated: false };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.authenticated = action.payload;
    },
  },
});

export const { setAuth } = slice.actions;
export default slice.reducer;
