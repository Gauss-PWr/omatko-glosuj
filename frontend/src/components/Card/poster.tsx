import { Lecture, Poster } from "@/types";
import { useState } from "react";
import { useLectureVotes } from "../../hooks/Lectures";
import VoteLecture from "../Vote/lecture";
import "./card.css";
import { usePosterVotes } from "../../hooks/Posters";
import VotePoster from "../Vote/poster";

const PosterCard = (poster: Poster) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hasVote } = usePosterVotes();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      key={poster.posterId}
      className={`card ${hasVote(poster.posterId) ? "voted" : ""}`}
    >
      <div className="card-header" onClick={toggleExpand}>
        <h3>{poster.posterName}</h3>
      </div>
      <div className={`card-full-info ${isExpanded ? "open" : ""}`}>
        <div className="card-description">
          <p>{poster.posterAuthor}</p>
          <div>{poster.posterDescription}</div>
        </div>
        <VotePoster posterId={poster.posterId} />
      </div>
    </div>
  );
};

export default PosterCard;
