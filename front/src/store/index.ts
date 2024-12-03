// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import presentationsReducer from './slices/presentationsSlice.ts';

export const store = configureStore({
  reducer: {
    presentations: presentationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;