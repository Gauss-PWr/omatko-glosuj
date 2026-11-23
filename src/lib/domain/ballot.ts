import type { Category } from "./vote";

/** A user's current picks and scores, as sent from server to client. */
export type BallotState = {
  /** slotId -> picked presentationId */
  picks: Record<number, number>;
  /** scoreKey(presentationId, category) -> score */
  scores: Record<string, number>;
};

export function scoreKey(presentationId: number, category: Category): string {
  return `${presentationId}:${category}`;
}
