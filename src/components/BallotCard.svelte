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
        return "border-zinc-200/80 dark:border-zinc-700/80";
    });
</script>

<article
    hidden={hidden || filteredOut}
    class="theme-surface w-full rounded-2xl border-2 bg-white p-4 shadow-[0_8px_28px_-18px_rgba(41,45,50,0.3)] transition-[border-color,box-shadow] duration-200 {border}"
>
    {@render children()}
</article>
