import type { Category } from "$lib/domain/vote";
import { actions } from "astro:actions";

/** Client-only pick/score state until vote actions are wired to the DB. */
export const slotPick = $state<Record<number, number | null>>({});

export const scores = $state<Record<string, number>>({});

export const ui = $state({ panel: "day-0", hideVoted: false });

export function scoreKey(presentationId: number, category: Category): string {
  return `${presentationId}:${category}`;
}

export function isVoted(
  presentationId: number,
  categories: readonly Category[],
): boolean {
  return categories.every(
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
