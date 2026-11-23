<script lang="ts">
  import { url } from "$lib/url";
  import PickButton from "./PickButton.svelte";
  import TalkBallot from "./TalkBallot.svelte";
  import BallotCard from "./BallotCard.svelte";
  import type { TalkCard } from "$lib/server/schedule";
  import type { Category } from "$lib/domain/vote";
  import { excerpt } from "$lib/excerpt";
  import { collapse, expand, ms } from "$lib/client/motion";
  import { slotPick } from "$lib/client/ballot.svelte";

  const TALK_CATEGORIES: Category[] = ["t_1", "t_2"];

  let {
    slotId,
    talks,
    timeRange,
    startMs,
    endMs,
    showStats = false,
  }: {
    slotId: number;
    talks: TalkCard[];
    timeRange: string;
    startMs: number;
    endMs: number;
    showStats?: boolean;
  } = $props();

  let now = $state(Date.now());
  const live = $derived(startMs <= now && now < endMs);
  const pickedId = $derived(slotPick[slotId] ?? null);

  $effect(() => {
    const id = setInterval(() => {
      now = Date.now();
    }, 15_000);
    return () => clearInterval(id);
  });

  function trackLabel(track: TalkCard["track"]): string | null {
    if (track === "applied") return "Zastosowania";
    if (track === "theory") return "Teoria";
    return null;
  }
</script>

<section id={`slot-${slotId}`} class="flex w-full scroll-mt-16 flex-col">
  <header>
    <p class="flex h-6 items-center gap-2 text-sm font-bold">
      <span>{timeRange}</span>
      <span
        class="rounded-full bg-o-orange px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
        class:invisible={!live}
        aria-hidden={!live}
      >
        Na żywo
      </span>
    </p>
  </header>

  {#each talks as talk, index (talk.id)}
    {#if pickedId == null || pickedId === talk.id}
      <div
        class="flex flex-col pt-2.5"
        in:expand={{ duration: ms(320) }}
        out:collapse={{ duration: ms(320) }}
      >
        {#if pickedId == null && index > 0}
          <p
            class="pb-2 text-center text-xs font-bold tracking-widest text-[color:var(--muted-ink)] uppercase"
            aria-hidden="true"
            in:expand={{ duration: ms(320) }}
            out:collapse={{ duration: ms(320) }}
          >
            — albo —
          </p>
        {/if}
        <BallotCard
          presentationId={talk.id}
          categories={TALK_CATEGORIES}
          picked={pickedId === talk.id}
          track={talk.track}
        >
          {#snippet header()}
            <h3 class="text-base font-semibold leading-snug sm:text-lg">
              <a href={url(`/prezentacja/${talk.id}`)}>{talk.title}</a>
            </h3>
            <p class="text-sm">
              {#if trackLabel(talk.track)}
                <span
                  class="text-xs font-bold tracking-wider uppercase
                    {talk.track === 'theory' ? 'text-o-orange' : 'text-o-blue'}"
                >
                  {trackLabel(talk.track)}
                </span>
                <span class="text-[color:var(--muted-ink)]" aria-hidden="true">
                  ·
                </span>
              {/if}
              <span class="font-medium">{talk.author}</span>
            </p>
          {/snippet}
          {#if talk.abstract}
            <p class="text-sm leading-snug text-[color:var(--muted-ink)]">
              {excerpt(talk.abstract)}
            </p>
          {/if}
          <div
            class="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
          >
            <div class="flex flex-wrap items-center gap-x-4">
              <a
                class="inline-flex min-h-9 items-center text-sm font-semibold text-o-blue underline-offset-4 hover:underline"
                href={url(`/prezentacja/${talk.id}`)}
              >
                Czytaj całość →
              </a>
              {#if showStats}
                <a
                  class="inline-flex min-h-9 items-center text-sm font-semibold text-o-blue underline-offset-4 hover:underline"
                  href={url(`/stats/${talk.id}`)}
                >
                  Statystyki →
                </a>
              {/if}
            </div>
            <PickButton {slotId} presentationId={talk.id} />
          </div>
          {#if pickedId === talk.id}
            <div
              class="mt-2 border-t border-[color:var(--line)] pt-3"
              in:expand={{ duration: ms(320) }}
              out:collapse={{ duration: ms(320) }}
            >
              <TalkBallot {slotId} presentationId={talk.id} showPick={false} />
            </div>
          {/if}
        </BallotCard>
      </div>
    {/if}
  {/each}
</section>
