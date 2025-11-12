import { LectureScore, PosterScore } from "@/types";

const Leaderboard = ({
  presentations,
}: {
  presentations: LectureScore[] | PosterScore[];
}) => {
  return (
    <ul className="leaderboard">
      {presentations.map((presentation) => (
        <li
          key={presentation.lectureName ?? presentation.posterName}
          className="leaderboard-item"
        >
          <div className="title">
            {presentation.lectureName ?? presentation.posterName}
          </div>{" "}
          <div className="speaker">
            {presentation.speakerName ?? presentation.posterAuthor}
          </div>{" "}
          <div className="score">{presentation.score.toFixed(2)}</div>
          <div className="votes">Głosów: {presentation.votes}</div>
        </li>
      ))}
    </ul>
  );
};

export default Leaderboard;
