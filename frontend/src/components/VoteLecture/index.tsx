import { useEffect, useState } from "react";
import "./vote.css";
import useLectureVotes from "@/components/Lectures/votes";
import { useRef } from "react";

const VoteLectures = ({ lectureId }: { lectureId: number }) => {
  const [voteMerytorykaValue, setVoteMerytorykaValue] = useState<number | "">(
    ""
  );
  const [voteFormaValue, setVoteFormaValue] = useState<number | "">("");

  const { getVote, addVote, updateVote, removeVote } = useLectureVotes();
  const existingVote = getVote(lectureId);

  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (voteMerytorykaValue === "" && voteFormaValue === "") return;

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const payload = {
        lectureId,
        vote: {
          merytorykaPoints:
            voteMerytorykaValue === "" ? null : voteMerytorykaValue,
          formaPoints: voteFormaValue === "" ? null : voteFormaValue,
        },
      };
      if (existingVote) {
        updateVote(payload);
      } else {
        addVote(payload);
      }
    }, 600);

    return () => window.clearTimeout(debounceRef.current);
  }, [
    lectureId,
    voteMerytorykaValue,
    voteFormaValue,
    existingVote,
    addVote,
    updateVote,
  ]);

  const handleDelete = () => {
    window.clearTimeout(debounceRef.current);
    removeVote(lectureId);
    setVoteMerytorykaValue("");
    setVoteFormaValue("");
  };

  return (
    <div className="vote">
      <div>
        Merytoryka: {voteMerytorykaValue ? voteMerytorykaValue : "Brak"}
      </div>
      <div className="vote-merytoryka">
        <input
          type="range"
          name={`vote-merytoryka-${lectureId}`}
          min="1"
          max="10"
          value={voteMerytorykaValue}
          onChange={(e) => setVoteMerytorykaValue(Number(e.target.value))}
        />
      </div>
      <div className="vote-forma">
        <div>Forma: {voteFormaValue ? voteFormaValue : "Brak"}</div>
        <input
          type="range"
          name={`vote-forma-${lectureId}`}
          min="1"
          max="10"
          value={voteFormaValue}
          onChange={(e) => setVoteFormaValue(Number(e.target.value))}
        />
      </div>
      <div className="vote-delete">
        <button type="button" onClick={handleDelete}>
          Usuń głos
        </button>
      </div>
    </div>
  );
};
export default VoteLectures;
