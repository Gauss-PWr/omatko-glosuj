import { setPosters, setLectures } from '../store/slices/presentationsSlice';
import { store } from "../store/index.ts";
import axios from "axios";
import API_CALL_URL from '../config.ts';


const parseLecturesResponse = (lectures: LectureResponse[]): Presentation[] =>
    lectures.map((lecture: LectureResponse) => ({
      id: lecture.lecture_id,
      title: `${lecture.lecture_name} (${lecture.lecture_category})`,
      name: lecture.speaker_name,
      rating: [
        {
          name: "merytoryka",
          value: lecture.vote_merytoryka !== null ? lecture.vote_merytoryka : -1,
        },
        {
          name: "forma",
          value: lecture.vote_forma !== null ? lecture.vote_forma : -1,
        },
      ],
    }));
  
  const parsePosterResponse = (posters: PosterResponse[]): Presentation[] =>
    posters.map((poster: PosterResponse) => ({
      id: poster.poster_id,
      title: poster.poster_name,
      name: poster.poster_author,
      rating: [
        {
          name: "merytoryka",
          value: poster.vote_merytoryka !== null ? poster.vote_merytoryka : -1,
        },
        {
          name: "estetyka",
          value: poster.vote_estetyka !== null ? poster.vote_estetyka : -1,
        },
      ],
    }));
  
  const getLectures = async (state: Auth) => {
    try {
      const res = await axios.get(`${API_CALL_URL}/lectures/user/lectures`, {
        headers: {
          Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
          Accept: "application/json",
        },
      });
      if (res.status === 200) {
        const parsedData = parseLecturesResponse(res.data["lectures"]);
        store.dispatch(setLectures(parsedData));
      }
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        console.log(err);
      }
    }
  };


  const getPosters = async (state: Auth) => {
    try {
      const res = await axios.get(`${API_CALL_URL}/posters/user/posters`, {
        headers: {
          Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
          Accept: "application/json",
        },
      });
      if (res.status === 200) {
        const parsedData = parsePosterResponse(res.data["posters"]);
        store.dispatch(setPosters(parsedData));
      }
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        console.log(err);
      }
    }
  };


  export { getLectures, getPosters };