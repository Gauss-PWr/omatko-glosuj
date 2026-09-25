<script lang="ts">
  import { ui } from "$lib/client/ballot.svelte";
</script>

{#if ui.panel !== "settings"}
  <div
    class="theme-filter sticky top-0 z-10 -mx-4 mb-4 border-b border-zinc-200 bg-[#f6f5f1]/95 px-4 py-3 backdrop-blur-sm"
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
          onchange={() => (ui.hideVoted = !ui.hideVoted)}
        />
        <span
          class="h-7 w-12 rounded-full bg-zinc-300 transition-colors duration-200 peer-checked:bg-o-green dark:bg-zinc-700 peer-checked:dark:bg-o-green"
        ></span>
        <span
          class="absolute left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5"
        ></span>
      </span>
    </label>
  </div>
{/if}
