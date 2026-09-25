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
    <VoteSection
        {presentationId}
        categories={POSTER_CATEGORIES}
        enabled={true}
    />
    <div class="mt-3 flex h-9 items-center">
        <button
            type="button"
            disabled={pending || !fullyVoted}
            class="h-9 w-16 rounded-lg border border-zinc-300 px-2 text-xs font-bold text-zinc-600 transition-colors duration-150 hover:border-zinc-400 hover:bg-zinc-50 disabled:hover:bg-transparent dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            class:invisible={!fullyVoted}
            aria-hidden={!fullyVoted}
            onclick={reset}
        >
            Resetuj
        </button>
    </div>
</div>
