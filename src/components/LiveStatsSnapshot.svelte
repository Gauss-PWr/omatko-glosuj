<script lang="ts">
  import { url } from "$lib/url";
  import { onMount } from "svelte";

  onMount(() => {
    let stopped = false;
    let refreshing = false;
    let refreshQueued = false;

    async function refreshSnapshot() {
      if (refreshing) {
        refreshQueued = true;
        return;
      }

      refreshing = true;
      try {
        const response = await fetch(
          `${window.location.pathname}${window.location.search}`,
          { cache: "no-store", headers: { Accept: "text/html" } },
        );
        if (response.redirected) {
          window.location.assign(response.url);
          return;
        }
        if (!response.ok) return;

        const html = await response.text();
        if (stopped) return;

        const nextDocument = new DOMParser().parseFromString(html, "text/html");
        const currentSnapshot = document.querySelector("main");
        const nextSnapshot = nextDocument.querySelector("main");
        if (!currentSnapshot || !nextSnapshot) return;

        currentSnapshot.replaceChildren(
          ...Array.from(nextSnapshot.childNodes, (node) =>
            document.importNode(node, true),
          ),
        );
      } catch {
        // Keep the last server-rendered snapshot if a refresh temporarily fails.
      } finally {
        refreshing = false;
        if (refreshQueued && !stopped) {
          refreshQueued = false;
          void refreshSnapshot();
        }
      }
    }

    const events = new EventSource(url("/api/stats/events"));
    events.addEventListener("refresh", () => void refreshSnapshot());

    return () => {
      stopped = true;
      events.close();
    };
  });
</script>

<span class="sr-only" aria-live="polite">Statystyki na żywo</span>
