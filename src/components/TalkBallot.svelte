<script lang="ts">
    import { actions } from "astro:actions";
    import type { Snippet } from "svelte";
    import VoteSection from "./VoteSection.svelte";
    import { slotPick, isVoted, resetScores } from "$lib/client/ballot.svelte";
    import type { Category } from "$lib/domain/vote";

    const TALK_CATEGORIES: { id: Category; label: string }[] = [
        { id: "t_1", label: "Merytoryka" },
        { id: "t_2", label: "Forma" },
    ];

    const categoryIds = TALK_CATEGORIES.map((c) => c.id);

    let {
        slotId,
        presentationId,
        swap,
    }: {
        slotId: number;
        presentationId: number;
        swap?: Snippet;
    } = $props();

    let pending = $state(false);
    const picked = $derived(slotPick[slotId] === presentationId);
    const fullyVoted = $derived(isVoted(presentationId, categoryIds));

    async function pick() {
        if (pending) return;
        pending = true;
        const result = await actions.pickTalk({ presentationId });
        if (result.error) {
            pending = false;
            return;
        }
        const previous = slotPick[slotId];
        if (previous != null && previous !== presentationId) {
            await resetScores(previous, categoryIds);
        }
        slotPick[slotId] = presentationId;
        pending = false;
    }

    async function unpick() {
        if (pending || !picked) return;
        pending = true;
        const result = await actions.unpickTalk({ presentationId });
        pending = false;
        if (result.error) return;
        slotPick[slotId] = null;
    }

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
        categories={TALK_CATEGORIES}
        enabled={picked}
    />
    <div
        class="mt-3 grid h-9 w-full grid-cols-[4rem_minmax(0,1fr)] items-center gap-2"
    >
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
        <div class="flex min-w-0 items-center justify-end gap-1">
            <button
                type="button"
                disabled={pending}
                class="h-9 w-19 shrink-0 rounded-lg px-1 text-xs font-bold transition-[background-color,color,transform] duration-150 active:scale-[0.98] disabled:opacity-60
                    {picked
                    ? 'border border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300'
                    : 'bg-o-blue text-white'}"
                onclick={() => (picked ? unpick() : pick())}
            >
                {picked ? "Usuń głos" : "Wybieram"}
            </button>
            {@render swap?.()}
        </div>
    </div>
</div>
