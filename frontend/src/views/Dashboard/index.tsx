import { useLectures } from "@/hooks/Lectures";
import { usePosters } from "@/hooks/Posters";
import { useEffect, useState } from "react";
import { useGetAllVotesQuery } from "@/services/votes";
import Chart from "chart.js/auto";
import { AllVotes, LectureVotePayload } from "@/types";
import "./dashboard.css";

const SCALE_MERYTORYKA = 0.6;
const SCALE_FORMA = 0.4;

const Dashboard = () => {
  const { lectures } = useLectures();
  const { posters } = usePosters();
  const { data, isLoading } = useGetAllVotesQuery(undefined, {
    pollingInterval: 5000,
  });

  const uniqueVotes = data ? data.lectures.length + data.posters.length : 0;

  const scoreLectures = (category: "stosowana" | "teoretyczna") => {
    if (!data || !lectures) return null;
    return lectures.map((lecture) => {
      if (lecture.lectureCategory === category) {
        return {
          lectureName: lecture.lectureName,
          speakerName: lecture.speakerName,
          score: data.lectures
            .filter((vote) => vote.lectureId === lecture.lectureId)
            .reduce(
              (sum, vote: LectureVotePayload) =>
                sum +
                vote.vote.merytorykaPoints * SCALE_MERYTORYKA +
                vote.vote.formaPoints * SCALE_FORMA,
              0
            ),
        };
      }
    });
  };

  const scorePosters = () => {
    if (!data || !posters) return null;
    return posters.map((poster) => {
      return {
        posterName: poster.posterName,
        posterAuthor: poster.posterAuthor,
        score: data.posters
          .filter((vote) => vote.posterId === poster.posterId)
          .reduce(
            (sum, vote) =>
              sum +
              vote.vote.merytorykaPoints * SCALE_MERYTORYKA +
              vote.vote.estetykaPoints * SCALE_FORMA,
            0
          ),
      };
    });
  };
  const topLectures = (category: "stosowana" | "teoretyczna") => {
    const scored = scoreLectures(category);
    if (!scored) return null;
    return scored
      .filter((lecture) => lecture !== undefined)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, 5) as {
      lectureName: string;
      speakerName: string;
      score: number;
    }[];
  };

  const topPosters = () => {
    const scored = scorePosters();
    if (!scored) return null;
    return scored.sort((a, b) => b.score - a.score).slice(0, 5) as {
      posterName: string;
      posterAuthor: string;
      score: number;
    }[];
  };

  return (
    <div className="dashboard uniform-width">
      {data && !isLoading ? (
        <>
          <p>Aktywnych uczestników: {data.active_users}</p>
          <p>Unikalnych głosów: {uniqueVotes}</p>q21
          <h3>Top 5 wykładów z bloku stosowanej</h3>
          <ul className="leaderboard">
            {topLectures("stosowana")?.map(
              (lecture) =>
                lecture && (
                  <li key={lecture.lectureName} className="leaderboard-item">
                    <div className="title">{lecture.lectureName}</div>{" "}
                    <div className="speaker">{lecture.speakerName}</div>{" "}
                    <div className="score">{lecture.score.toFixed(2)}</div>
                  </li>
                )
            )}
          </ul>
          <h3>Top 5 wykładów z bloku teoretycznej</h3>
          <ul className="leaderboard">
            {topLectures("teoretyczna")?.map(
              (lecture) =>
                lecture && (
                  <li key={lecture.lectureName} className="leaderboard-item">
                    <div className="title">{lecture.lectureName}</div>{" "}
                    <div className="speaker">{lecture.speakerName}</div>{" "}
                    <div className="score">{lecture.score.toFixed(2)}</div>
                  </li>
                )
            )}
          </ul>
          <h3>Top 5 plakatów</h3>
          <ul className="leaderboard">
            {topPosters()?.map((poster) => (
              <li key={poster.posterName} className="leaderboard-item">
                <div className="title">{poster.posterName}</div>{" "}
                <div className="speaker">{poster.posterAuthor}</div>{" "}
                <div className="score">{poster.score.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
};
export default Dashboard;
