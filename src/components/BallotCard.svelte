<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Category } from "$lib/domain/vote";
  import type { Track } from "$lib/domain/presentation";
  import { isVoted, ui } from "$lib/client/ballot.svelte";

  let {
    presentationId,
    categories,
    hidden = false,
    picked = false,
    track = null,
    children,
  }: {
    presentationId: number;
    categories: Category[];
    hidden?: boolean;
    picked?: boolean;
    track?: Track | null;
    children: Snippet;
  } = $props();

  const voted = $derived(isVoted(presentationId, categories));
  const filteredOut = $derived(ui.hideVoted && voted);
  const border = $derived.by(() => {
    if (voted) return "border-o-green";
    if (picked && track === "applied") return "border-o-blue";
    if (picked && track === "theory") return "border-o-orange";
    return "border-transparent";
  });
</script>

<article
  hidden={hidden || filteredOut}
  class="theme-surface w-full border-l-[5px] p-4 transition-[border-color] duration-200 {border}"
>
  {@render children()}
</article>
