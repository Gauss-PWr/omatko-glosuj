<script lang="ts">
  import { setHideVoted, ui } from "$lib/client/ballot.svelte";
  import { matches } from "$lib/search";

  let { posters = [] }: { posters?: { id: number; text: string }[] } = $props();

  const onPosters = $derived(ui.panel === "poster");
  const noResults = $derived(
    onPosters &&
      ui.query.trim() !== "" &&
      !posters.some((poster) => matches(ui.query, poster.text)),
  );
</script>

{#if ui.panel !== "settings"}
  <div
    class="theme-filter sticky top-0 z-10 -mx-4 mb-4 border-b px-4 py-3 backdrop-blur-sm"
  >
    <label
      class="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold"
    >
      <span>Ukryj ocenione</span>
      <span class="relative inline-flex h-7 w-12 shrink-0 items-center">
        <input
          type="checkbox"
          class="peer sr-only"
          checked={ui.hideVoted}
          onchange={() => setHideVoted(!ui.hideVoted)}
        />
        <span
          class="h-7 w-12 rounded-full bg-zinc-300 transition-colors duration-200 peer-checked:bg-o-green dark:bg-zinc-700 peer-checked:dark:bg-o-green"
        ></span>
        <span
          class="absolute left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5"
        ></span>
      </span>
    </label>
    {#if onPosters}
      <input
        type="search"
        bind:value={ui.query}
        placeholder="Szukaj plakatu: tytuł, autor, opis"
        aria-label="Szukaj plakatu"
        autocomplete="off"
        enterkeyhint="search"
        class="mt-3 h-10 w-full rounded-[15px] border border-[color:var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-o-blue focus:ring-4 focus:ring-o-blue/25"
      />
      {#if noResults}
        <p class="mt-2 text-sm text-[color:var(--muted-ink)]" role="status">
          Brak plakatów pasujących do „{ui.query.trim()}”.
        </p>
      {/if}
    {/if}
  </div>
{/if}
