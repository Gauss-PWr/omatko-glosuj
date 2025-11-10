import { Poster } from "@/types";
import { useState } from "react";
import "./card.css";
import { usePosterVotes } from "../../hooks/Posters";
import VotePoster from "../Vote/poster";
import MathText from "@/components/MathText";

const MIN_LENGTH_FOR_TRUNCATION = 250; // Characters to trigger "Read More"

const PosterCard = (poster: Poster) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { hasVote } = usePosterVotes();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);

  const showTruncationButton =
    poster.posterDescription.length > MIN_LENGTH_FOR_TRUNCATION;

  return (
    <div
      key={poster.posterId}
      className={`card ${hasVote(poster.posterId) ? "voted" : ""}`}
    >
      <div className="card-header" onClick={toggleExpand}>
        <h3>
          <MathText text={poster.posterName} />
        </h3>
      </div>
      <div className={`card-full-info ${isExpanded ? "open" : ""}`}>
        <div className="card-description">
          <p>{poster.posterAuthor}</p>
          <div
            className={`description-wrapper ${
              !isDescriptionExpanded && showTruncationButton ? "truncated" : ""
            }`}
          >
            <MathText text={poster.posterDescription} />
          </div>
          {showTruncationButton && (
            <button className="read-more-btn" onClick={toggleDescription}>
              {isDescriptionExpanded ? "Pokaż mniej" : "Czytaj więcej"}
            </button>
          )}
        </div>
        <VotePoster posterId={poster.posterId} />
      </div>
    </div>
  );
};

export default PosterCard;
