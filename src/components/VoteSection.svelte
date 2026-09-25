<script lang="ts">
  import { actions } from "astro:actions";
  import type { Category } from "$lib/domain/vote";
  import { scores, scoreKey } from "$lib/client/ballot.svelte";

  type Cat = { id: Category; label: string };

  let {
    presentationId,
    categories,
    enabled,
  }: {
    presentationId: number;
    categories: Cat[];
    enabled: boolean;
  } = $props();

  let pending = $state(false);

  async function cast(category: Category, score: number) {
    if (!enabled || pending) return;
    pending = true;
    const result = await actions.vote({
      presentationId,
      category,
      score,
    });
    pending = false;
    if (result.error) return;
    scores[scoreKey(presentationId, category)] = score;
  }
</script>

<div class:opacity-60={!enabled} class="transition-opacity duration-200">
  <p
    class="mb-2 h-4 truncate text-xs leading-4 text-zinc-500 dark:text-zinc-400"
    class:invisible={enabled}
    aria-hidden={enabled}
  >
    Najpierw wybierz ten referat, żeby ocenić.
  </p>
  <div class="flex flex-col gap-3">
    {#each categories as category (category.id)}
      {@const current = scores[scoreKey(presentationId, category.id)]}
      <div class="min-w-0">
        <p
          class="mb-1 text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300"
        >
          {category.label}
        </p>
        <div class="flex w-full gap-1">
          {#each [1, 2, 3, 4, 5] as n (n)}
            <button
              type="button"
              disabled={!enabled || pending}
              class="h-9 min-w-0 flex-1 rounded-lg border text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]
                {current === n
                ? 'border-o-orange bg-o-orange text-white shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-o-blue hover:bg-cyan-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'}"
              onclick={() => cast(category.id, n)}
            >
              {n}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
