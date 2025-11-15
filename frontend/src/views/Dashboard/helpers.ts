import {
  LectureVotePayload,
  LectureVotePayloadExtended,
  PosterVotePayload,
} from "@/types";
import { LectureScore, PosterScore, AllVotes, Lecture } from "@/types";
import { all } from "node_modules/axios/index.cjs";

const SCALE_MERYTORYKA = 0.6;
const SCALE_FORMA = 0.4;

export const scoreLectures = (
  lectures,
  votes: LectureVotePayloadExtended[],
  category: "stosowana" | "teoretyczna"
): LectureScore[] | null => {
  if (!votes || !lectures) return null;

  const { voteIds } = fraudCheck(lectures, votes);

  return lectures.map((lecture) => {
    if (lecture.lectureCategory === category) {
      return {
        lectureName: lecture.lectureName,
        speakerName: lecture.speakerName,
        score: votes
          .filter((vote) => vote.id === lecture.id)
          .filter((vote) => !voteIds.includes(vote.voteId))
          .reduce(
            (sum, vote: LectureVotePayload, _, { length }) =>
              sum +
              (vote.vote.merytorykaPoints * SCALE_MERYTORYKA +
                vote.vote.formaPoints * SCALE_FORMA) /
                length,
            0
          ),
        votes: votes.filter((vote) => vote.id === lecture.id)
          .length,
      };
    }
  });
};

export const scorePosters = (
  posters,
  votes: PosterVotePayload[]
): PosterScore[] | null => {
  if (!votes || !posters) return null;
  return posters.map((poster) => {
    return {
      posterName: poster.posterName,
      posterAuthor: poster.posterAuthor,
      score: votes
        .filter((vote) => vote.id === poster.id)
        .reduce(
          (sum, vote: PosterVotePayload, _, { length }) =>
            sum +
            (vote.vote.merytorykaPoints * SCALE_MERYTORYKA +
              vote.vote.estetykaPoints * SCALE_FORMA) /
              length,
          0
        ),
      votes: votes.filter((vote) => vote.id === poster.id).length,
    };
  });
};

export const topLectures = (
  lectures,
  votes: LectureVotePayloadExtended[],
  category: "stosowana" | "teoretyczna"
) => {
  const scored = scoreLectures(lectures, votes, category);
  if (!scored) return null;
  return scored.sort((a, b) => b.score - a.score).slice(0, 5) as LectureScore[];
};

export const topPosters = (posters, votes: PosterVotePayload[]) => {
  const scored = scorePosters(posters, votes);
  if (!scored) return null;
  return scored.sort((a, b) => b.score - a.score).slice(0, 5) as PosterScore[];
};

export const fraudCheck = (
  lectures: Lecture[],
  lectureVotes: LectureVotePayloadExtended[]
) => {
  // Map id to datetime
  const lectureDateMap: Record<number, string> = {};
  lectures.forEach((lecture) => {
    lectureDateMap[lecture.id] = lecture.lectureDatetime;
  });

  // Map userId to array of {voteId, datetime} they've voted for
  const userVoteDatetimes: Record<
    string,
    { voteId: number; datetime: string }[]
  > = {};
  lectureVotes.forEach((vote) => {
    const dt = lectureDateMap[vote.id];
    if (!dt) return;
    if (!userVoteDatetimes[vote.userId]) {
      userVoteDatetimes[vote.userId] = [];
    }
    userVoteDatetimes[vote.userId].push({ voteId: vote.voteId, datetime: dt });
  });

  // Find fraudulent votes (duplicates per user per datetime)
  let fraudulentVotes = 0;
  const fraudulentVoteIds: number[] = [];
  Object.values(userVoteDatetimes).forEach((votesArr) => {
    const dtMap: Record<string, number[]> = {};
    votesArr.forEach(({ voteId, datetime }) => {
      if (!dtMap[datetime]) dtMap[datetime] = [];
      dtMap[datetime].push(voteId);
    });
    Object.values(dtMap).forEach((ids) => {
      if (ids.length > 1) {
        // All but the first are fraudulent
        fraudulentVotes += ids.length - 1;
        fraudulentVoteIds.push(...ids);
      }
    });
  });

  return { count: fraudulentVotes, voteIds: fraudulentVoteIds };
};
