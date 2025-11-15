import { useEffect, useState } from "react";
import "./vote.css";
import { useLectureVote } from "@/hooks/Lectures";
import { useRef } from "react";
import React from "react";

const VoteLecture = ({ id }: { id: number }) => {
  const { getVote, addVote, updateVote, removeVote, hasVote } =
    useLectureVote(id);
  const existingVote = getVote();

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
        id,
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
    removeVote();
    setVoteMerytorykaValue("");
    setVoteFormaValue("");
  };

  return (
    <div className="vote">
      <div className="vote-merytoryka">
        <div>
          Merytoryka: {voteMerytorykaValue ? voteMerytorykaValue : "Brak"}
        </div>
        <input
          type="range"
          name={`vote-merytoryka-${id}`}
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
          name={`vote-forma-${id}`}
          min="1"
          max="10"
          value={voteFormaValue}
          onChange={(e) => setVoteFormaValue(Number(e.target.value))}
        />
      </div>
      <div className="vote-delete">
        <button
          type="button"
          className={`has-vote ${!hasVote() ? "disabled" : ""}`}
          onClick={handleDelete}
          disabled={!hasVote()}
        >
          Usuń głos
        </button>
      </div>
    </div>
  );
};

export default React.memo(VoteLecture);
