import { ReactElement, useState, useEffect } from "react";
import { useLectures, usePosters} from '../hooks/usePresentations.ts';
import "./Panel.css";
import { useAuth } from "./Auth.tsx";
import { getLectures, getPosters, findLecture} from "../hooks/getPresentations.ts";
import { setLectureRating, setPosterRating, updateLectureRatings, updatePosterRatings} from "../store/slices/presentationsSlice.ts";
import {store} from "../store/index.ts";

const Panel = (): ReactElement => {
    const {state} = useAuth();
    const [showLectures, setShowLectures] = useState(true)
    useEffect(() => { 
      getLectures(state); // zmien na dispatch
      getPosters(state);

      }, [state]);

      return <div className="Panel">
    <div className="button-wrapper">
    <button className="changePanel lecture-button" onClick={() => setShowLectures(true)}>Wykłady</button>
    <button className="changePanel poster-button" onClick={() => setShowLectures(false)}>Plakaty</button>

    </div>
    {showLectures? <Lectures/> : <Posters/> }
  </div>

}
const Lectures = () => {
    const {state} = useAuth();
    const [lectureCode, setLectureCode] = useState("");
    const [isDataCorect, setIsDataCorrect] = useState(true);
    const lectures = useLectures();


    const searchLecture = async (code: string) => {
      setIsDataCorrect(code.length >= 4? false : true);
      setLectureCode(code);
      if (code.length !== 4) return;

      const res = findLecture(code, state)

      if (await res) {
        setLectureCode("");
        setIsDataCorrect(true);
        getLectures(state);
      } else {
        setIsDataCorrect(false);
      }

    }


    return (
        <div className="Lectures">
          {lectures.map((item: Presentation, index: number) => (
            <Lecture key={`lecture-${index}`} {...item} index={index}/>
          ))}
        <div className={`Lecture add ${isDataCorect ? "" : "incorect-code"}`}>
          <input
            className="lecture-code"
            type="text"
            placeholder="Dodaj wykład..."
            value={lectureCode}
            onChange={(e) => searchLecture(e.target.value)}
          />
      </div>
        </div>
      );
}

const Lecture = (lecture: Presentation & {index: number}): ReactElement => {
    const { state } = useAuth();
    const [ratings, setRatings] = useState(lecture.rating);
    const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

    
    const handleRatingChange = (rating_index: number, newValue: number) => {
      const updatedRatings = [...ratings];
      updatedRatings[rating_index] = { ...updatedRatings[rating_index], value: newValue };
      setRatings(updatedRatings);
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }

      const timeout = setTimeout(() => {
        if (!ratings.every((rating, idx) => rating.value === lecture.rating[idx].value)) {
          store.dispatch(setLectureRating({ id: lecture.id, rating: updatedRatings }));
          if(state.user?.token) {
            store.dispatch(updateLectureRatings({ 
              lectureId: lecture.id, 
              ratings: updatedRatings, 
              token: state.user?.token
            })) //else token expired
            
          }
        }
      }, 1000);

      setUpdateTimeout(timeout)
    
    };

    useEffect(() => {
      return () => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
      };
    }, [updateTimeout]);
  
    return (
      <div className="Lecture">
        <div className="lecture-info">
          <div className="title">{lecture.title}</div>
          <div className="name">{lecture.name}</div>
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
          <span className="rating-value">{rating.value < 0 ? "Brak" : rating.value}</span>
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


const Posters = (): ReactElement => {
  const items = usePosters();
  return (
      <div className="Posters">
          {items.map((item: Presentation, index: number) => (<Poster key={index} {...item}/>))}
      </div>
  )
}
  
const Poster = (poster: Presentation): ReactElement => {

    const [firstTime, setFirstTime] = useState((poster.rating[0].value < 1 && poster.rating[1].value < 1)) 
    const { state } = useAuth();
    const [ratings, setRatings] = useState(poster.rating);
    const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

    
    
    const handleRatingChange = (index: number, newValue: number) => {
        const updatedRatings = [...ratings];
        updatedRatings[index] = { ...updatedRatings[index], value: newValue };
        setRatings(updatedRatings);

        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        const timeout = setTimeout(() => {
          if (!ratings.every((rating, idx) => rating.value === poster.rating[idx].value)) {
            store.dispatch(setPosterRating({ id: poster.id, rating: updatedRatings }));
            if(state.user?.token) {
              store.dispatch(updatePosterRatings({ 
                posterId: poster.id, 
                ratings: updatedRatings,
                firstTime,
                token: state.user?.token
              }))
            }
            setFirstTime(false);
          }
        }, 1000);

        setUpdateTimeout(timeout);
      };
    
      
      useEffect(() => {
        return () => {
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }
        };
      }, [updateTimeout]);


    return ( 
        <div className="Lecture">
        <div className="lecture-info">
          <div className="title">{poster.title}</div>
          <div className="name">{poster.name}</div>
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


    export default Panel;