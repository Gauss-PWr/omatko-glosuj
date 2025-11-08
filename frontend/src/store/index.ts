import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/auth";
import { lecturesApi } from "@/services/lectures";
import lecturesReducer from "@/store/lectures";
import authReducer from "@/store/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lectures: lecturesReducer,
    [lecturesApi.reducerPath]: lecturesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, lecturesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
