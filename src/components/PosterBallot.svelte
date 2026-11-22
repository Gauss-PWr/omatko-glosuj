<script lang="ts">
  import VoteSection from "./VoteSection.svelte";
  import type { Category } from "$lib/domain/vote";
  import { isVoted, resetScores } from "$lib/client/ballot.svelte";

  const POSTER_CATEGORIES: { id: Category; label: string }[] = [
    { id: "p_1", label: "Merytoryka" },
    { id: "p_2", label: "Estetyka" },
  ];

  const categoryIds = POSTER_CATEGORIES.map((c) => c.id);

  let { presentationId }: { presentationId: number } = $props();

  let pending = $state(false);
  const fullyVoted = $derived(isVoted(presentationId, categoryIds));

  async function reset() {
    if (pending || !fullyVoted) return;
    pending = true;
    await resetScores(presentationId, categoryIds);
    pending = false;
  }
</script>

<div class="mt-4">
  <VoteSection {presentationId} categories={POSTER_CATEGORIES} enabled={true} />
  <div class="mt-3 flex h-9 items-center">
    <button
      type="button"
      disabled={pending || !fullyVoted}
      class="h-9 w-16 rounded-lg border border-[color:var(--line)] px-2 text-xs font-bold text-[color:var(--muted-ink)] transition-colors duration-150 hover:bg-[var(--hover-tint)] disabled:hover:bg-transparent"
      class:invisible={!fullyVoted}
      aria-hidden={!fullyVoted}
      onclick={reset}
    >
      Resetuj
    </button>
  </div>
</div>
