<script lang="ts">
  import { url } from "$lib/url";
  import BallotCard from "./BallotCard.svelte";
  import type { TalkCard } from "$lib/server/schedule";
  import type { Category } from "$lib/domain/vote";
  import { excerpt } from "$lib/excerpt";

  const POSTER_CATEGORIES: Category[] = ["p_1", "p_2"];

  let { talk, showStats = false }: { talk: TalkCard; showStats?: boolean } =
    $props();

  const searchText = $derived(
    [talk.title, talk.author, talk.abstract ?? ""].join(" "),
  );
</script>

<BallotCard
  id={`p-${talk.id}`}
  presentationId={talk.id}
  categories={POSTER_CATEGORIES}
  {searchText}
>
  {#snippet header()}
    <h3 class="text-base font-semibold leading-snug sm:text-lg">
      <a href={url(`/prezentacja/${talk.id}`)}>{talk.title}</a>
    </h3>
    <p class="text-sm font-medium">{talk.author}</p>
  {/snippet}
  {#if talk.abstract}
    <p class="text-sm leading-snug text-[color:var(--muted-ink)]">
      {excerpt(talk.abstract)}
    </p>
  {/if}
  <div class="mt-1.5 flex flex-wrap items-center justify-between gap-x-4">
    <a
      class="inline-flex min-h-9 items-center text-sm font-semibold text-o-blue underline-offset-4 hover:underline"
      href={url(`/prezentacja/${talk.id}`)}
    >
      Szczegóły i ocena →
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
</BallotCard>
