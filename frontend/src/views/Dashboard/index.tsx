import { useLectures } from "@/hooks/Lectures";
import { usePosters } from "@/hooks/Posters";
import { useGetAllVotesQuery } from "@/services/votes";
import Leaderboard from "@/views/Dashboard/leaderboard";
import {
  scoreLectures,
  scorePosters,
  topLectures,
  topPosters,
  fraudCheck,
} from "@/views/Dashboard/helpers";
import Histogram from "@/charts/MeanVotesHistogram";
import "./dashboard.css";

const Dashboard = () => {
  const { lectures } = useLectures();
  const { posters } = usePosters();
  const { data, isLoading } = useGetAllVotesQuery(undefined, {
    pollingInterval: 5000,
  });

  const uniqueVotes = data ? data.lectures.length + data.posters.length : 0;
  const { count: fraudulentVotes, voteIds: fraudulentVoteIds } = data
    ? fraudCheck(lectures, data.lectures)
    : { count: 0, voteIds: [] };

  return (
    <div className="dashboard uniform-width">
      {data && !isLoading ? (
        <>
          <div className="single-stats">
            <p>Aktywnych uczestników: {data.active_users}</p>
            <p>Unikalnych głosów: {uniqueVotes}</p>
            <p>Średnia głosów: {uniqueVotes / data.active_users}</p>
            <p>
              Podwójne głosy:{" "}
              <span style={{ color: "red" }}>{fraudulentVotes}</span>
            </p>
          </div>
          <h3>Top 5 wykładów z bloku stosowanej</h3>
          <Leaderboard
            presentations={topLectures(lectures, data.lectures, "stosowana")!}
          />
          <h3>Top 5 wykładów z bloku teoretycznej</h3>
          <Leaderboard
            presentations={topLectures(lectures, data.lectures, "teoretyczna")!}
          />
          <h3>Top 5 plakatów</h3>
          <Leaderboard presentations={topPosters(posters, data.posters)!} />
          <h3>Rozkład wyników</h3>
          <div className="score-histogram">
            <Histogram
              dataset={{
                stosowana:
                  scoreLectures(lectures, data.lectures, "stosowana") || [],
                teoretyczna:
                  scoreLectures(lectures, data.lectures, "teoretyczna") || [],
                plakaty: scorePosters(posters, data.posters) || [],
              }}
            />
          </div>
        </>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
};
export default Dashboard;
