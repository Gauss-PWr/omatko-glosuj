import { Lecture } from "@/types";
import { useState } from "react";
import { useLectureVotes } from "../../hooks/Lectures";
import VoteLecture from "../Vote/lecture";
import MathText from "@/components/MathText";

import "./card.css";
const LectureCard = (lecture: Lecture) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hasVote } = useLectureVotes();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      key={lecture.lectureId}
      className={`card ${hasVote(lecture.lectureId) ? "voted" : ""}`}
    >
      <div className="card-header" onClick={toggleExpand}>
        <h3>
          <MathText text={lecture.lectureName} />
        </h3>
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
          <div>
            <MathText text={lecture.lectureDescription} />
          </div>
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
