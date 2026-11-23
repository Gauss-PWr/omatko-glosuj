import type { Category } from "$lib/domain/vote";
import { scoreKey, type BallotState } from "$lib/domain/ballot";
import { actions } from "astro:actions";

export { scoreKey };

/** Client mirror of the user's picks/scores; filled by `hydrateBallot`. */
export const slotPick = $state<Record<number, number | null>>({});

export const scores = $state<Record<string, number>>({});

export const ui = $state({
  panel: "day-0",
  hideVoted: false,
  /** Bumped when the hide-voted switch is used; clears per-card overrides. */
  collapseEpoch: 0,
  /** Bumped when server state is applied; re-evaluates collapsing. */
  hydrations: 0,
  /** Poster search text. */
  query: "",
  /** True once server state is applied; gates transitions. */
  animate: false,
});

const HIDE_VOTED_KEY = "omatko-hide-voted";

export function setHideVoted(value: boolean): void {
  ui.hideVoted = value;
  ui.collapseEpoch++;
  try {
    localStorage.setItem(HIDE_VOTED_KEY, value ? "1" : "0");
  } catch {}
}

export function restoreHideVoted(): void {
  try {
    ui.hideVoted = localStorage.getItem(HIDE_VOTED_KEY) === "1";
  } catch {}
}

export function hydrateBallot(state: BallotState): void {
  ui.hydrations++;
  for (const key of Object.keys(slotPick)) delete slotPick[Number(key)];
  for (const key of Object.keys(scores)) delete scores[key];
  Object.assign(slotPick, state.picks);
  Object.assign(scores, state.scores);
}

export function isVoted(
  presentationId: number,
  categories: readonly Category[],
): boolean {
  return categories.every(
    (category) => scores[scoreKey(presentationId, category)] != null,
  );
}

export function hasAnyScore(
  presentationId: number,
  categories: readonly Category[],
): boolean {
  return categories.some(
    (category) => scores[scoreKey(presentationId, category)] != null,
  );
}

export function clearScores(
  presentationId: number,
  categories: readonly Category[],
): void {
  for (const category of categories) {
    delete scores[scoreKey(presentationId, category)];
  }
}

export async function resetScores(
  presentationId: number,
  categories: readonly Category[],
): Promise<boolean> {
  const result = await actions.resetVote({ presentationId });
  if (result.error) return false;
  clearScores(presentationId, categories);
  return true;
}
