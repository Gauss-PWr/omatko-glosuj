<script lang="ts">
  import { actions } from "astro:actions";
  import {
    slotPick,
    hasAnyScore,
    clearScores,
  } from "$lib/client/ballot.svelte";
  import type { Category } from "$lib/domain/vote";

  const TALK_CATEGORIES: Category[] = ["t_1", "t_2"];

  let { slotId, presentationId }: { slotId: number; presentationId: number } =
    $props();

  let pending = $state(false);
  let confirming = $state<"switch" | "unpick" | null>(null);
  let error = $state<string | null>(null);

  const picked = $derived(slotPick[slotId] === presentationId);

  function request() {
    error = null;
    if (picked) {
      if (hasAnyScore(presentationId, TALK_CATEGORIES)) confirming = "unpick";
      else void unpick();
      return;
    }
    const previous = slotPick[slotId];
    if (previous != null && hasAnyScore(previous, TALK_CATEGORIES)) {
      confirming = "switch";
      return;
    }
    void pick();
  }

  async function pick() {
    if (pending) return;
    confirming = null;
    pending = true;
    const result = await actions.pickTalk({ presentationId });
    pending = false;
    if (result.error) {
      error = result.error.message;
      return;
    }
    const previous = slotPick[slotId];
    if (previous != null) clearScores(previous, TALK_CATEGORIES);
    slotPick[slotId] = presentationId;
  }

  async function unpick() {
    if (pending) return;
    confirming = null;
    pending = true;
    const result = await actions.unpickTalk({ presentationId });
    pending = false;
    if (result.error) {
      error = result.error.message;
      return;
    }
    clearScores(presentationId, TALK_CATEGORIES);
    slotPick[slotId] = null;
  }
</script>

<div class="contents">
  <button
    type="button"
    disabled={pending}
    class="h-9 min-w-28 shrink-0 rounded-[15px] px-4 text-sm font-semibold transition-[background-color,color,transform] duration-150 active:scale-[0.98] disabled:opacity-60
      {picked
      ? 'border border-[color:var(--line)] text-[color:var(--muted-ink)]'
      : 'bg-o-green text-white'}"
    onclick={request}
  >
    {picked ? "Usuń wybór" : "Wybieram"}
  </button>

  {#if confirming}
    <div
      role="alertdialog"
      aria-label="Potwierdzenie"
      class="order-last w-full rounded-[9px] bg-o-orange/15 p-3 text-sm"
    >
      <p class="font-semibold">
        {confirming === "switch"
          ? "Zmiana usunie Twoje oceny drugiego referatu."
          : "Usunięcie wyboru usunie Twoje oceny tego referatu."}
      </p>
      <div class="mt-2 flex gap-2">
        <button
          type="button"
          class="h-9 rounded-lg bg-o-green px-4 text-xs font-bold text-white"
          onclick={confirming === "switch" ? pick : unpick}
        >
          {confirming === "switch" ? "Zmień" : "Usuń"}
        </button>
        <button
          type="button"
          class="h-9 rounded-lg border border-[color:var(--line)] px-4 text-xs font-bold text-[color:var(--muted-ink)]"
          onclick={() => (confirming = null)}
        >
          Anuluj
        </button>
      </div>
    </div>
  {/if}

  {#if error}
    <p
      role="alert"
      class="order-last w-full text-sm font-semibold text-o-orange"
    >
      {error}
    </p>
  {/if}
</div>
