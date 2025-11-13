import { useEffect, useState } from "react";
import "./vote.css";
import { usePosterVotes } from "@/hooks/Posters";
import { useRef } from "react";

const VotePosters = ({ posterId }: { posterId: number }) => {
  const { getVote, addVote, updateVote, removeVote, hasVote } =
    usePosterVotes();
  const existingVote = getVote(posterId);

  const [voteMerytorykaValue, setVoteMerytorykaValue] = useState<number | "">(
    existingVote?.vote.merytorykaPoints ?? ""
  );
  const [voteEstetykaValue, setVoteEstetykaValue] = useState<number | "">(
    existingVote?.vote.estetykaPoints ?? ""
  );

  const debounceRef = useRef<number | undefined>(undefined);

  // Sync state with existing vote when it loads
  useEffect(() => {
    if (existingVote) {
      setVoteMerytorykaValue(existingVote.vote.merytorykaPoints ?? "");
      setVoteEstetykaValue(existingVote.vote.estetykaPoints ?? "");
    }
  }, [existingVote]); // Only re-sync if the vote ID changes

  useEffect(() => {
    if (voteMerytorykaValue === "" && voteEstetykaValue === "") return;
    if (
      voteMerytorykaValue === existingVote?.vote.merytorykaPoints &&
      voteEstetykaValue === existingVote?.vote.estetykaPoints
    ) {
      return; // No changes to save
    }

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const payload = {
        posterId,
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
  }, [voteMerytorykaValue, voteEstetykaValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = () => {
    window.clearTimeout(debounceRef.current);
    removeVote(posterId);
    setVoteMerytorykaValue("");
    setVoteEstetykaValue("");
  };

  return (
    <div
      className="vote"
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div>
        Merytoryka: {voteMerytorykaValue ? voteMerytorykaValue : "Brak"}
      </div>
      <div className="vote-merytoryka">
        <input
          type="range"
          name={`vote-merytoryka-${posterId}`}
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
          name={`vote-estetyka-${posterId}`}
          min="1"
          max="10"
          value={voteEstetykaValue}
          onChange={(e) => setVoteEstetykaValue(Number(e.target.value))}
        />
      </div>
      <div className="vote-delete">
        <button
          type="button"
          className={`has-vote ${!hasVote(posterId) ? "disabled" : ""}`}
          onClick={handleDelete}
          disabled={!hasVote(posterId)}
        >
          Usuń głos
        </button>
      </div>
    </div>
  );
};
export default VotePosters;
