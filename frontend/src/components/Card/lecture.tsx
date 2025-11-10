import { useState } from "react";
import { Lecture } from "@/types";
import VoteLecture from "@/components/Vote/lecture";
import { useLectureVotes } from "@/hooks/Lectures";
import MathText from "@/components/MathText";
import "./card.css";

const MIN_LENGTH_FOR_TRUNCATION = 250; // Characters to trigger "Read More"

const LectureCard = ({
  lectureId,
  lectureName,
  speakerName,
  lectureDescription,
  lectureDatetime,
}: Lecture) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { hasVote } = useLectureVotes();

  const toggleOpen = () => {
    if (isOpen && isDescriptionExpanded) {
      setIsDescriptionExpanded(false);
      return;
    }
    setIsOpen((prev) => !prev);
  };
  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);

  const showTruncationButton =
    lectureDescription.length > MIN_LENGTH_FOR_TRUNCATION;

  return (
    <div className={`card ${hasVote(lectureId) ? "voted" : ""}`}>
      <div className="card-header" onClick={toggleOpen}>
        <h3>
          <MathText text={lectureName} />
        </h3>
        <p>
          {new Date(lectureDatetime).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className={`card-full-info ${isOpen ? "open" : ""}`}>
        <div
          className={`description-wrapper ${
            !isDescriptionExpanded && showTruncationButton ? "truncated" : ""
          }`}
          onClick={toggleOpen}
        >
          <p className="card-speaker">{speakerName}</p>
          <MathText text={lectureDescription} />
        </div>
        {showTruncationButton && (
          <button className="read-more-btn" onClick={toggleDescription}>
            {isDescriptionExpanded ? "Pokaż mniej" : "Pokaż więcej"}
          </button>
        )}
        <VoteLecture lectureId={lectureId} />
      </div>
    </div>
  );
};

export default LectureCard;
