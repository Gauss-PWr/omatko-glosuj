import React, { useEffect, useState, useRef } from "react";
import "./vote.css";
import { usePosterVote } from "@/hooks/Posters";

const VotePosters = ({ id }: { id: number }) => {
  const {
    vote: existingVote,
    addVote,
    updateVote,
    removeVote,
    hasVote,
  } = usePosterVote(id);

  const [voteMerytorykaValue, setVoteMerytorykaValue] = useState<number | "">(
    ""
  );
  const [voteEstetykaValue, setVoteEstetykaValue] = useState<number | "">("");

  const debounceRef = useRef<number | undefined>(undefined);

  // Sync local inputs only when the remote vote actually changes
  useEffect(() => {
    if (existingVote) {
      const remoteM = existingVote.vote.merytorykaPoints ?? "";
      const remoteE = existingVote.vote.estetykaPoints ?? "";
      if (voteMerytorykaValue !== remoteM) setVoteMerytorykaValue(remoteM);
      if (voteEstetykaValue !== remoteE) setVoteEstetykaValue(remoteE);
    } else {
      if (voteMerytorykaValue !== "") setVoteMerytorykaValue("");
      if (voteEstetykaValue !== "") setVoteEstetykaValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingVote]);

  useEffect(() => {
    if (voteMerytorykaValue === "" && voteEstetykaValue === "") return;

    if (
      existingVote &&
      voteMerytorykaValue === existingVote.vote.merytorykaPoints &&
      voteEstetykaValue === existingVote.vote.estetykaPoints
    ) {
      return; // nothing changed
    }

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const payload = {
        id,
        vote: {
          merytorykaPoints:
            voteMerytorykaValue === "" ? null : voteMerytorykaValue,
          estetykaPoints: voteEstetykaValue === "" ? null : voteEstetykaValue,
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
    voteEstetykaValue,
    existingVote,
    addVote,
    updateVote,
    id,
  ]);

  const handleDelete = () => {
    window.clearTimeout(debounceRef.current);
    removeVote(); // hook supplies id via closure
    setVoteMerytorykaValue("");
    setVoteEstetykaValue("");
  };

  return (
    <div
      className="vote"
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
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
      <div className="vote-estetyka">
        <div>Estetyka: {voteEstetykaValue ? voteEstetykaValue : "Brak"}</div>
        <input
          type="range"
          name={`vote-estetyka-${id}`}
          min="1"
          max="10"
          value={voteEstetykaValue}
          onChange={(e) => setVoteEstetykaValue(Number(e.target.value))}
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

export default React.memo(VotePosters);
