import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/auth";
import { lecturesApi } from "@/services/lectures";
import { votesApi } from "@/services/votes";
import { postersApi } from "@/services/posters";
import lecturesReducer from "@/store/lectures";
import authReducer from "@/store/auth";
import lecturesVotesReducer from "@/store/lectureVotes";
import postersReducer from "@/store/posters";
import postersVotesReducer from "@/store/posterVotes";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lectures: lecturesReducer,
    lectureVotes: lecturesVotesReducer,
    posters: postersReducer,
    posterVotes: postersVotesReducer,
    [postersApi.reducerPath]: postersApi.reducer,
    [lecturesApi.reducerPath]: lecturesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [votesApi.reducerPath]: votesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      lecturesApi.middleware,
      postersApi.middleware,
      votesApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
