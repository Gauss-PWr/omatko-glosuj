<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import type { Category } from "$lib/domain/vote";
  import type { Track } from "$lib/domain/presentation";
  import { isVoted, ui } from "$lib/client/ballot.svelte";
  import { collapse, expand, ms } from "$lib/client/motion";
  import { matches } from "$lib/search";

  let {
    id,
    presentationId,
    categories,
    picked = false,
    track = null,
    searchText = null,
    header,
    children,
  }: {
    id?: string;
    presentationId: number;
    categories: Category[];
    picked?: boolean;
    track?: Track | null;
    /** When set, the card is hidden unless it matches the poster search. */
    searchText?: string | null;
    /** Always visible: title and author. */
    header: Snippet;
    /** Details; foldable per card, and collectively by "hide voted". */
    children: Snippet;
  } = $props();

  const voted = $derived(isVoted(presentationId, categories));
  // Cards the user can fold: a picked talk or a fully voted card.
  const eligible = $derived(voted || picked);

  // Collective rule ("hide voted"): voted cards collapse when the page loads
  // or the switch is flipped, but not the moment a card gets voted - it stays
  // open until the next render. Set by the effect below; it must be an effect,
  // not a $derived (lazy: it would first run when voting completes).
  let auto = $state(false);
  // Individual choice (true = collapsed, false = open). Lives only in this
  // component instance, so a re-render or page load starts without one.
  let override = $state<boolean | null>(null);

  // Switch flipped / server state applied: re-apply the rule to this card and
  // drop its individual choice. Votes are read untracked on purpose.
  $effect(() => {
    void ui.collapseEpoch;
    void ui.hydrations;
    auto = ui.hideVoted && untrack(() => voted);
    override = null;
  });

  $effect(() => {
    if (!eligible) {
      auto = false;
      override = null;
    }
  });

  const collapsed = $derived(eligible && (override ?? auto));
  const filtered = $derived(
    searchText != null && !matches(ui.query, searchText),
  );
  const border = $derived.by(() => {
    if (voted) return "border-o-green";
    if (picked && track === "applied") return "border-o-blue";
    if (picked && track === "theory") return "border-o-orange";
    return "border-transparent";
  });
</script>

<article
  {id}
  hidden={filtered}
  class="theme-surface w-full scroll-mt-16 border-l-[5px] p-3.5 transition-[border-color] duration-200 {border}"
>
  <div class="flex items-start gap-2">
    <div class="min-w-0 flex-1">{@render header()}</div>
    {#if eligible}
      <button
        type="button"
        class="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[color:var(--muted-ink)] transition-colors hover:bg-[var(--hover-tint)]"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Rozwiń" : "Zwiń"}
        onclick={() => (override = !collapsed)}
      >
        <svg
          viewBox="0 0 24 24"
          class="size-5 transition-transform duration-300"
          class:rotate-180={!collapsed}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    {/if}
  </div>
  {#if !collapsed}
    <div
      class="pt-1.5"
      in:expand={{ duration: ms(320) }}
      out:collapse={{ duration: ms(320) }}
    >
      {@render children()}
    </div>
  {/if}
</article>
