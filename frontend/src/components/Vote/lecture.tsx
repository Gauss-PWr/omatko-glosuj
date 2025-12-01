import { useEffect, useState } from "react";
import "./vote.css";
import { useLectureVote } from "@/hooks/Lectures";
import { useRef } from "react";

const VoteLecture = ({ id }: { id: number }) => {
  const {
    vote: existingVote,
    addVote,
    updateVote,
    removeVote,
    hasVote,
  } = useLectureVote(id);

  const [voteMerytorykaValue, setVoteMerytorykaValue] = useState<number | "">(
    existingVote?.vote?.merytorykaPoints ?? ""
  );
  const [voteFormaValue, setVoteFormaValue] = useState<number | "">(
    existingVote?.vote?.formaPoints ?? ""
  );
  useEffect(() => {
    const fetchedMerytoryka = existingVote?.vote?.merytorykaPoints ?? "";
    const fetchedForma = existingVote?.vote?.formaPoints ?? "";

    setVoteMerytorykaValue((prev) =>
      prev === fetchedMerytoryka ? prev : fetchedMerytoryka
    );
    setVoteFormaValue((prev) => (prev === fetchedForma ? prev : fetchedForma));
  }, [existingVote?.vote?.merytorykaPoints, existingVote?.vote?.formaPoints]);

  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mVal =
      voteMerytorykaValue === "" ? null : Number(voteMerytorykaValue);
    const fVal = voteFormaValue === "" ? null : Number(voteFormaValue);

    const existingM = existingVote?.vote?.merytorykaPoints ?? null;
    const existingF = existingVote?.vote?.formaPoints ?? null;

    // nothing to save
    if (mVal === null && fVal === null) return;

    // no changes compared to existing stored vote
    if (existingVote && mVal === existingM && fVal === existingF) return;

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const payload = {
        id,
        vote: {
          merytorykaPoints: mVal,
          formaPoints: fVal,
        },
      };
      if (existingVote) {
        updateVote(payload);
      } else {
        addVote(payload);
      }
    }, 600);

    return () => window.clearTimeout(debounceRef.current);
    // only depend on primitives (not the whole existingVote object)
  }, [
    voteMerytorykaValue,
    voteFormaValue,
    existingVote?.vote?.merytorykaPoints,
    existingVote?.vote?.formaPoints,
    id,
    addVote,
    updateVote,
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

export default VoteLecture;
