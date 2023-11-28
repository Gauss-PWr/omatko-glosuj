import { ReactElement, useState, useEffect } from "react";
import "./Panel.css";
import axios, { AxiosError } from "axios";
import { useAuth } from "./Auth.tsx";
import API_CALL_URL from "../config.ts";

const parseLecturesResponse = (lectures: LectureResponse[]): Presentation[] =>
  lectures.map((lecture: LectureResponse) => ({
    id: lecture.lecture_id,
    title: lecture.lecture_name,
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

const parsePosterResponse = (lectures: PosterResponse[]): Presentation[] =>
  lectures.map((poster: PosterResponse) => ({
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

const getDataFromApi = async (options: GetDataOptions, state: Auth) => {
  try {
    const res = await axios.get(options.url, {
      headers: {
        Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
        Accept: "application/json",
      },
    });
    if (res.status === 200) {
      options.setter(options.parser(res.data[options.data_name]));
    }
  } catch (err) {
    if (!axios.isAxiosError(err)) {
      console.log(err);
    }
  }
};

const Panel = (): ReactElement => {
  const { state } = useAuth();
  const [lectureList, setLectureList] = useState<Presentation[]>([]);
  const [posterList, setPosterList] = useState<Presentation[]>([]);
  const [showLectures, setShowLectures] = useState(true)

  useEffect(() => {
    getDataFromApi(
      {
        data_name: "lectures",
        url: `${API_CALL_URL}/lectures/user/lectures`,
        setter: setLectureList,
        parser: parseLecturesResponse,
      },
      state
    );

    getDataFromApi(
      {
        data_name: "posters",
        url: `${API_CALL_URL}/posters/user/posters`,
        setter: setPosterList,
        parser: parsePosterResponse,
      },
      state
    );
  }, [state]);

  return <div>
    <button onClick={() => setShowLectures(prev => !prev)}>{showLectures? 'Prezentacje' : 'Wykłady'}</button>
    {showLectures? <Lectures items={lectureList} setter={setLectureList}/> : <Posters items={posterList}/> }
  </div>
};

const Lectures = ({items, setter}: ItemProp): ReactElement => {

    const { state } = useAuth();
    const [lectureCode, setLectureCode] = useState("");
    const [isDataCorect, setIsDataCorect] = useState(true);
    

  const searchLecture = async (code: string): Promise<void> => {
    if (code.length <= 4) setIsDataCorect(true);
    setLectureCode(code);
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
        getDataFromApi(
            {
              data_name: "lectures",
              url: `${API_CALL_URL}/lectures/user/lectures`,
              setter: setter,
              parser: parseLecturesResponse,
            },
            state
          );
        setLectureCode("");
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
    <div>
      {items.map((item: Presentation, index) => (
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

const Lecture = (lecture: Presentation): ReactElement => {
    const { state } = useAuth();
    const [ratings, setRatings] = useState(lecture.rating);
    
  
    const handleRatingChange = (index: number, newValue: number) => {
      const updatedRatings = [...ratings];
      updatedRatings[index] = { ...updatedRatings[index], value: newValue };
      setRatings(updatedRatings);
    };
  
    useEffect(() => {
      const updateRatings = async () => {
        try {
          await axios.put(
            `${API_CALL_URL}/lectures/votes/${lecture.id}`,
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
      lecture.id,
      state.user?.token?.tokenType,
      state.user?.token?.accessToken,
    ]);
  
    return (
      <div className="Lecture">
        <div className="lecture-info">
          <div className="name">{lecture.title}</div>
          <div className="lecturer">{lecture.name}</div>
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
    <div>
        <span>{rating.name + ': '}</span>
        <span>{rating.value < 0 ? "Brak" : rating.value}</span>
    </div>
    <input
        type="range"
        name="rating"
        min={1}
        max={10}
        onChange={(e) => rating.onRatingChange(parseInt(e.target.value))}
        value={rating.value}
    />
    </div>
);
};

const Posters = ({items}: ItemProp): ReactElement => {
    return (
        <div>
            {items.map((item: Presentation, index: number) => (<Poster key={index} {...item}/>))}
        </div>
    )
}

const Poster = (poster: Presentation):ReactElement => {

    const [firstTime, setFirstTime] = useState((poster.rating[0].value < 1 && poster.rating[1].value < 1)) 
    const { state } = useAuth();
    const [ratings, setRatings] = useState(poster.rating);
    
    const handleRatingChange = (index: number, newValue: number) => {
        const updatedRatings = [...ratings];
        updatedRatings[index] = { ...updatedRatings[index], value: newValue };
        setRatings(updatedRatings);
      };

    useEffect(() => {
        if (!(ratings[0].value >= 1 || ratings[1].value >= 1)) return

        const updateRatings = async () => {

          try {
            if (firstTime) {
                await axios.post(`${API_CALL_URL}/posters/votes-posters/${poster.id}/`, {
                    merytoryka_points: ratings[0].value < 1 ? null : Math.min(ratings[0].value, 10),
                    estetyka_points: ratings[1].value < 1 ? null : Math.min(ratings[0].value, 10),
                },
                {
                    headers: {
                      Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
                      Accept: "application/json",
                    },
                  }
                )
                setFirstTime(false)
            } else {
                await axios.put(
                    `${API_CALL_URL}/posters/votes-posters-update/${poster.id}/`,
                    {
                      merytoryka_points:
                        ratings[0].value < 1 ? null : Math.min(ratings[0].value, 10),
                      estetyka_points:
                        ratings[1].value < 1 ? null : Math.min(ratings[0].value, 10),
                    },
                    {
                      headers: {
                        Authorization: `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
                        Accept: "application/json",
                      },
                    }
                  );
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
        poster.id,
        state.user?.token?.tokenType,
        state.user?.token?.accessToken,
        firstTime
      ]);

    return ( 
        <div className="Lecture">
        <div className="lecture-info">
          <div className="name">{poster.title}</div>
          <div className="lecturer">{poster.name}</div>
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
    )
}

export default Panel