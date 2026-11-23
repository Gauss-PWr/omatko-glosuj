import { votingService } from "$lib/server";
import { scoreKey, type BallotState } from "$lib/domain/ballot";

export async function loadBallotState(userId: number): Promise<BallotState> {
  const [picks, votes] = await Promise.all([
    votingService.getPicks(userId),
    votingService.getVotes(userId),
  ]);

  return {
    picks: Object.fromEntries(picks.map((p) => [p.slotId, p.presentationId])),
    scores: Object.fromEntries(
      votes.map((v) => [scoreKey(v.presentationId, v.category), v.score]),
    ),
  };
}
