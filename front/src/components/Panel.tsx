import { ReactElement, useState, useEffect } from "react";
import "./Panel.css";
import axios, { AxiosError } from "axios";
import { useAuth } from "./Auth";
import API_CALL_URL from "../config.ts";

const parseLectures = (lectures: LectureResponse[]) =>
  lectures.map((lecture: LectureResponse) => ({
    lecture_id: lecture.lecture_id,
    lecture_name: lecture.lecture_name,
    lecturer_name: lecture.speaker_name,
    ratings: [
      {
        name: "merytoryka",
        value: lecture.vote_merytoryka !== null ? lecture.vote_merytoryka : -1,
      },
      {
        name: "forma",
        value: lecture.vote_merytoryka !== null ? lecture.vote_forma : -1,
      },
    ],
  }));

const getLectures = async (
  state: Auth,
  setter: React.Dispatch<React.SetStateAction<Lecture[]>>
) => {
  const res = await axios.get(`${API_CALL_URL}/lectures/user/lectures`, {
    headers: {
      Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
      Accept: "application/json",
    },
  });

  if ((await res.status) === 200) {
    setter(parseLectures(res.data.lectures));
  }
};

const Panel = (): ReactElement => {
  const { state } = useAuth();
  const [activeLectureList, setActiveLectureList] = useState<Lecture[]>([]);
  const [lectureCode, setLecture] = useState("");
  const [isDataCorect, setIsDataCorect] = useState(true);

  useEffect(() => {
    getLectures(state, setActiveLectureList);
  }, [state]);

  const searchLecture = async (code: string): Promise<void> => {
    if (code.length <= 4) setIsDataCorect(true);
    setLecture(code);
    if (code.length !== 4) return;
    try {
      const res = await axios.post(
        `${API_CALL_URL}/lectures/add-to-user`,
        { lecture_code: code.toUpperCase() },
        {
          headers: {
            Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
            Accept: "application/json",
          },
        }
      );

      if ((await res.status) === 200) {
        getLectures(state, setActiveLectureList);
        setLecture("");
      }
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        console.log(err);
      }
      const error = err as AxiosError;
      switch (error.response?.status) {
        case 404:
          setIsDataCorect(false);
      }
    }
  };

  return (
    <div className="Panel">
      {activeLectureList.map((item: Lecture, index) => (
        <Lecture key={index} {...item} />
      ))}
      <div className={`Lecture add ${isDataCorect ? "" : "incorect-code"}`}>
        <input
          type="text"
          placeholder="Dodaj wykład..."
          value={lectureCode}
          onChange={(e) => searchLecture(e.target.value)}
        />
      </div>
    </div>
  );
};

const Lecture = (lecture: Lecture): ReactElement => {
  const { state } = useAuth();
  const [ratings, setRatings] = useState(lecture.ratings);

  const handleRatingChange = (index: number, newValue: number) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = { ...updatedRatings[index], value: newValue };
    setRatings(updatedRatings);
  };

  useEffect(() => {
    const updateRatings = async () => {
      try {
        const res = await axios.put(
          `${API_CALL_URL}/lectures/votes/${lecture.lecture_id}`,
          {
            merytoryka_points:
              ratings[0].value < 0 ? null : Math.min(ratings[0].value, 10),
            forma_points:
              ratings[1].value < 0 ? null : Math.min(ratings[0].value, 10),
          },
          {
            headers: {
              Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
              Accept: "application/json",
            },
          }
        );
        if ((await res.status) === 200) {
          console.log("git");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const timeoutId = setTimeout(() => {
      updateRatings();
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [
    ratings,
    lecture.lecture_id,
    state.user?.token?.tokenType,
    state.user?.token?.accessToken,
  ]);

  return (
    <div className="Lecture">
      <div className="lecture-info">
        <div className="name">{lecture.lecture_name}</div>
        <div className="lecturer">{lecture.lecturer_name}</div>
      </div>
      <div className="rating">
        {ratings.map((item, index) => (
          <RatingBar
            key={index}
            {...item}
            onRatingChange={(newValue) => handleRatingChange(index, newValue)}
          />
        ))}
      </div>
    </div>
  );
};

const RatingBar = (
  rating: Rating & { onRatingChange: (newValue: number) => void }
): ReactElement => {
  return (
    <div className="RatingBar">
      <span>{rating.name}</span>
      <span>{rating.value < 0 ? "Brak" : rating.value}</span>
      <input
        type="range"
        name="rating"
        min={0}
        max={10}
        onChange={(e) => rating.onRatingChange(parseInt(e.target.value))}
        value={rating.value}
      />
    </div>
  );
};

export default Panel;
