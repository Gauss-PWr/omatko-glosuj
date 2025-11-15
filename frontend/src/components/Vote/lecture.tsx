import { useEffect, useState } from "react";
import "./vote.css";
import { useLectureVote } from "@/hooks/Lectures";
import { useRef } from "react";
import React from "react";

const VoteLecture = ({ id }: { id: number }) => {
  const {
    vote: existingVote,
    addVote,
    updateVote,
    removeVote,
    hasVote,
  } = useLectureVote(id);

  const [voteMerytorykaValue, setVoteMerytorykaValue] = useState<number | "">(
    ""
  );
  const [voteFormaValue, setVoteFormaValue] = useState<number | "">("");

  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!existingVote) return;
    const remoteM = existingVote.vote.merytorykaPoints ?? "";
    const remoteF = existingVote.vote.formaPoints ?? "";
    if (voteMerytorykaValue !== remoteM) setVoteMerytorykaValue(remoteM);
    if (voteFormaValue !== remoteF) setVoteFormaValue(remoteF);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingVote]); // only react when remote vote changes

  useEffect(() => {
    if (voteMerytorykaValue === "" && voteFormaValue === "") return;
    if (
      existingVote &&
      voteMerytorykaValue === existingVote.vote.merytorykaPoints &&
      voteFormaValue === existingVote.vote.formaPoints
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
  }, [
    voteMerytorykaValue,
    voteFormaValue,
    existingVote,
    addVote,
    updateVote,
    id,
  ]);

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
          className={`has-vote ${!hasVote ? "disabled" : ""}`}
          onClick={handleDelete}
          disabled={!hasVote}
        >
          Usuń głos
        </button>
      </div>
    </div>
  );
};

export default React.memo(VoteLecture);
