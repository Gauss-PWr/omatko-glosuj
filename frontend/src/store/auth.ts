import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/types/states";
import { AuthPayload } from "@/types";

const initialState: AuthState = { authenticated: false, is_admin: false };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.authenticated = action.payload.authenticated;
      state.is_admin = action.payload.is_admin;
    },
  },
});

export const { setAuth } = slice.actions;
export default slice.reducer;
