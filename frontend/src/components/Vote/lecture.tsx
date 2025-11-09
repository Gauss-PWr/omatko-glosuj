import { useEffect, useState } from "react";
import "./vote.css";
import { useLectureVotes } from "@/hooks/Lectures";
import { useRef } from "react";

const VoteLectures = ({ lectureId }: { lectureId: number }) => {
  const { getVote, addVote, updateVote, removeVote, hasVote } =
    useLectureVotes();
  const existingVote = getVote(lectureId);

  const [voteMerytorykaValue, setVoteMerytorykaValue] = useState<number | "">(
    existingVote?.vote.merytorykaPoints ?? ""
  );
  const [voteFormaValue, setVoteFormaValue] = useState<number | "">(
    existingVote?.vote.formaPoints ?? ""
  );

  const debounceRef = useRef<number | undefined>(undefined);

  // Sync state with existing vote when it loads
  useEffect(() => {
    if (existingVote) {
      setVoteMerytorykaValue(existingVote.vote.merytorykaPoints ?? "");
      setVoteFormaValue(existingVote.vote.formaPoints ?? "");
    }
  }, [existingVote]); // Only re-sync if the vote ID changes

  useEffect(() => {
    if (voteMerytorykaValue === "" && voteFormaValue === "") return;
    if (
      voteMerytorykaValue === existingVote?.vote.merytorykaPoints &&
      voteFormaValue === existingVote?.vote.formaPoints
    ) {
      return; // No changes to save
    }

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
  }, [voteMerytorykaValue, voteFormaValue]);

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
        <button
          type="button"
          className={`has-vote ${!hasVote(lectureId) ? "disabled" : ""}`}
          onClick={handleDelete}
          disabled={!hasVote(lectureId)}
        >
          Usuń głos
        </button>
      </div>
    </div>
  );
};
export default VoteLectures;
