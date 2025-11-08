import { Lecture } from "@/types";
import { useState } from "react";
import VoteLecture from "../VoteLecture";
import "./card.css";
const LectureCard = (lecture: Lecture) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div key={lecture.lectureId} className="card">
      <div className="card-header" onClick={toggleExpand}>
        <h3>{lecture.lectureName}</h3>
        <p>
          {new Date(lecture.lectureDatetime).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className={`card-full-info ${isExpanded ? "open" : ""}`}>
        <div className="card-description">
          <p>{lecture.speakerName}</p>
          <div>{lecture.lectureDescription}</div>
        </div>
        <VoteLecture lectureId={lecture.lectureId} />
      </div>
    </div>
  );
};

// const PosterCard = () => {
//   return <div>poster card</div>;
// }

export default LectureCard;
