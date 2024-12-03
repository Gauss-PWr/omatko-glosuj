// store/slices/presentationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_CALL_URL from '../../config';

interface PresentationsState {
  lectures: Record<number, Presentation>;
  posters: Record<number, Presentation>;
}

const initialState: PresentationsState = {
  lectures: {},
  posters: {},
};

const presentationsSlice = createSlice({
  name: 'presentations',
  initialState,
  reducers: {
    setLectures: (state, action: PayloadAction<Presentation[]>) => {
      state.lectures = action.payload.reduce((acc, lecture) => {
        acc[lecture.id] = lecture;
        return acc;
      }, {} as Record<number, Presentation>);
    },
    setLectureRating: (state, action: PayloadAction<{ id: number, rating: Rating[] }>) => {
      const lecture = state.lectures[action.payload.id];
      if (lecture) {
        lecture.rating = action.payload.rating;
      }
    },
     setPosters: (state, action: PayloadAction<Presentation[]>) => {
      state.posters = action.payload.reduce((acc, poster) => {
        acc[poster.id] = poster;
        return acc;
      }, {} as Record<number, Presentation>);
    },
    setPosterRating: (state, action: PayloadAction<{ id: number, rating: Rating[] }>) => {
      const poster = state.posters[action.payload.id];
      if (poster) {
        poster.rating = action.payload.rating;
      }
    },
  }
});


export const updateLectureRatings = createAsyncThunk(
  'presentations/updateLectureRatings',
  async ({ 
    lectureId, 
    ratings, 
    token 
  }: {
    lectureId: number,
    ratings: Rating[],
    token: { tokenType: string, accessToken: string }
  }) => {
    const response = await axios.put(
      `${API_CALL_URL}/lectures/votes/${lectureId}`,
      {
        merytoryka_points: ratings[0].value < 0 ? null : Math.min(ratings[0].value, 10),
        forma_points: ratings[1].value < 0 ? null : Math.min(ratings[1].value, 10),
      },
      {
        headers: {
          Authorization: `${token.tokenType} ${token.accessToken}`,
        },
      }
    );
    return response.data;
  }
);

export const updatePosterRatings = createAsyncThunk(
  'presentations/updatePosterRatings',
  async ({ 
    posterId, 
    ratings,
    firstTime,
    token 
  }: {
    posterId: number,
    ratings: Rating[],
    firstTime: boolean,
    token: { tokenType: string, accessToken: string }
  }) => {
    const method = firstTime ? axios.post : axios.put;
    const response = await method(
      `${API_CALL_URL}/posters/votes-posters${firstTime? "" : "-update"}/${posterId}`,
      {
        merytoryka_points: ratings[0].value < 0 ? null : Math.min(ratings[0].value, 10),
        estetyka_points: ratings[1].value < 0 ? null : Math.min(ratings[1].value, 10),
      },
      {
        headers: {
          Authorization: `${token.tokenType} ${token.accessToken}`,
        },
      }
    );
    return response.data;
  }
);

export const { setLectures, setPosters, setLectureRating, setPosterRating } = presentationsSlice.actions;
export default presentationsSlice.reducer;