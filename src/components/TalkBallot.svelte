<script lang="ts">
  import VoteSection from "./VoteSection.svelte";
  import PickButton from "./PickButton.svelte";
  import { slotPick, isVoted, resetScores } from "$lib/client/ballot.svelte";
  import type { Category } from "$lib/domain/vote";

  const TALK_CATEGORIES: { id: Category; label: string }[] = [
    { id: "t_1", label: "Merytoryka" },
    { id: "t_2", label: "Forma" },
  ];

  const categoryIds = TALK_CATEGORIES.map((c) => c.id);

  let {
    slotId,
    presentationId,
    showPick = true,
  }: {
    slotId: number;
    presentationId: number;
    /** False when the pick button is already rendered by the parent. */
    showPick?: boolean;
  } = $props();

  let pending = $state(false);
  const picked = $derived(slotPick[slotId] === presentationId);
  const fullyVoted = $derived(isVoted(presentationId, categoryIds));

  async function reset() {
    if (pending || !fullyVoted) return;
    pending = true;
    await resetScores(presentationId, categoryIds);
    pending = false;
  }
</script>

<div class="flex flex-col gap-4">
  {#if showPick}
    <div class="flex flex-wrap items-center gap-2">
      <PickButton {slotId} {presentationId} />
    </div>
  {/if}
  <VoteSection {presentationId} categories={TALK_CATEGORIES} enabled={picked} />
  <div class="flex h-9 items-center">
    <button
      type="button"
      disabled={pending || !fullyVoted}
      class="h-9 rounded-lg border border-[color:var(--line)] px-3 text-xs font-bold text-[color:var(--muted-ink)] transition-colors duration-150 hover:bg-[var(--hover-tint)] disabled:hover:bg-transparent"
      class:invisible={!fullyVoted}
      aria-hidden={!fullyVoted}
      onclick={reset}
    >
      Resetuj oceny
    </button>
  </div>
</div>
