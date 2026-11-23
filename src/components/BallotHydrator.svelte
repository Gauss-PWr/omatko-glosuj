<script lang="ts">
  import { onMount } from "svelte";
  import {
    hydrateBallot,
    restoreHideVoted,
    ui,
  } from "$lib/client/ballot.svelte";
  import type { BallotState } from "$lib/domain/ballot";

  let { initial }: { initial: BallotState } = $props();

  // The store is module-level, so it can only be filled on the client. Wait
  // until the other islands have hydrated so server and client markup match.
  onMount(() => {
    let frame = 0;
    let tries = 0;
    const apply = () => {
      if (document.querySelector("astro-island[ssr]") && tries++ < 120) {
        frame = requestAnimationFrame(apply);
        return;
      }
      hydrateBallot(initial);
      restoreHideVoted();
      document.documentElement.removeAttribute("data-ballot-loading");
      frame = requestAnimationFrame(() => (ui.animate = true));
    };
    frame = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(frame);
  });
</script>
