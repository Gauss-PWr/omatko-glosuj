import { usePosters } from "@/hooks/Posters";
import PosterCard from "@/components/Card/poster";
import { useState, useMemo } from "react";
import "./view.css";

const Posters = () => {
  const { posters } = usePosters();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosters = useMemo(() => {
    if (!searchTerm.trim()) return posters;

    const lowerSearch = searchTerm.toLowerCase();
    return posters.filter((poster) => {
      const titleMatch = poster.posterName.toLowerCase().includes(lowerSearch);
      const authorsMatch = poster.posterAuthor
        .toLowerCase()
        .includes(lowerSearch);
      return titleMatch || authorsMatch;
    });
  }, [posters, searchTerm]);

  return (
    <>
      <div className="posters-view uniform-width">
        {filteredPosters.map((poster) => (
          <PosterCard key={poster.posterId} {...poster} />
        ))}
      </div>
      <div className="search-posters uniform-width">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Wyszukaj plakat..."
        />
      </div>
    </>
  );
};

export default Posters;
