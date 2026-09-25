<script lang="ts">
  import TalkBallot from "./TalkBallot.svelte";
  import BallotCard from "./BallotCard.svelte";
  import type { TalkCard } from "$lib/server/schedule";
  import type { Category } from "$lib/domain/vote";
  import { isVoted, slotPick, ui } from "$lib/client/ballot.svelte";

  const TALK_CATEGORIES: Category[] = ["t_1", "t_2"];

  let {
    slotId,
    talks,
    timeRange,
    startMs,
    endMs,
  }: {
    slotId: number;
    talks: TalkCard[];
    timeRange: string;
    startMs: number;
    endMs: number;
  } = $props();

  let shownId = $state(talks[0]?.id ?? 0);
  let now = $state(Date.now());
  const canSwap = $derived(talks.length > 1);
  const live = $derived(startMs <= now && now < endMs);
  const pickedId = $derived(slotPick[slotId] ?? null);
  const slotVoted = $derived(
    pickedId != null && isVoted(pickedId, TALK_CATEGORIES),
  );
  const shownIndex = $derived(
    Math.max(
      0,
      talks.findIndex((t) => t.id === shownId),
    ),
  );

  $effect(() => {
    const id = setInterval(() => {
      now = Date.now();
    }, 15_000);
    return () => clearInterval(id);
  });

  function cycleTalk() {
    if (!canSwap) return;
    const next = talks[(shownIndex + 1) % talks.length];
    if (next) shownId = next.id;
  }

  function trackLabel(track: TalkCard["track"]): string | null {
    if (track === "applied") return "Zastosowania";
    if (track === "theory") return "Teoria";
    return null;
  }
</script>

{#if !ui.hideVoted || !slotVoted}
  {#each talks as talk (talk.id)}
    <BallotCard
      presentationId={talk.id}
      categories={TALK_CATEGORIES}
      hidden={talk.id !== shownId}
      picked={pickedId === talk.id}
      track={talk.track}
    >
      <header class="mb-3">
        <p
          class="flex h-5 items-center gap-2 text-xs font-bold tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          <span
            class="rounded-full bg-o-orange px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
            class:invisible={!live}
            aria-hidden={!live}
          >
            Na żywo
          </span>
          <span>
            {timeRange}
            <span class="font-medium text-zinc-400 dark:text-zinc-500">
              · {shownIndex + 1}/{talks.length}
            </span>
          </span>
        </p>
      </header>
      <p
        class="h-4 text-xs font-bold tracking-wider uppercase
        {talk.track === 'applied' ? 'text-o-blue' : 'text-o-orange'}"
        class:invisible={!trackLabel(talk.track)}
        aria-hidden={!trackLabel(talk.track)}
      >
        {trackLabel(talk.track) ?? "—"}
      </p>
      <h3 class="text-lg font-semibold leading-tight">
        {talk.title}
      </h3>
      <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {talk.author}
      </p>
      {#if talk.abstract}
        <p
          class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          {talk.abstract}
        </p>
      {/if}
      <TalkBallot {slotId} presentationId={talk.id}>
        {#snippet swap()}
          <button
            type="button"
            disabled={!canSwap}
            class="h-9 w-14 shrink-0 rounded-lg border border-o-orange/40 bg-orange-50 px-1 text-xs font-bold text-orange-800 transition-[background-color,transform] duration-150 hover:bg-orange-100 active:scale-[0.98] disabled:opacity-40 dark:bg-orange-950 dark:text-orange-200 dark:hover:bg-orange-900"
            onclick={cycleTalk}
          >
            Zamień
          </button>
        {/snippet}
      </TalkBallot>
    </BallotCard>
  {/each}
{/if}
