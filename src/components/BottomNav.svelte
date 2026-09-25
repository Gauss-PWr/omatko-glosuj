<script lang="ts">
    import { ui } from "$lib/client/ballot.svelte";

    type Item = { id: string; label: string };

    let { items, initial }: { items: Item[]; initial: string } = $props();

    ui.panel = initial;

    $effect(() => {
        document.documentElement.dataset.ballot = ui.panel;
    });

    function dayNumber(id: string): number | null {
        const match = /^day-(\d+)$/.exec(id);
        return match ? Number(match[1]) + 1 : null;
    }
</script>

<nav
    class="theme-nav fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-1 pt-1.5 shadow-[0_-8px_24px_-18px_rgba(41,45,50,0.32)] backdrop-blur-sm"
    style="padding-bottom: max(0.5rem, env(safe-area-inset-bottom))"
>
    <ul
        class="mx-auto grid max-w-3xl items-stretch gap-1"
        style="grid-template-columns: repeat({items.length}, minmax(0, 1fr));"
    >
        {#each items as item (item.id)}
            {@const day = dayNumber(item.id)}
            <li>
                <button
                    type="button"
                    aria-label={item.label}
                    aria-current={ui.panel === item.id ? "page" : undefined}
                    class="flex h-16 w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 transition-[background-color,color,transform] duration-200 active:scale-[0.97]
            {ui.panel === item.id
                        ? 'bg-o-blue text-white shadow-sm'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}"
                    onclick={() => (ui.panel = item.id)}
                >
                    {#if day != null}
                        <span class="relative block size-6" aria-hidden="true">
                            <svg viewBox="0 0 24 24" class="size-6" fill="none">
                                <rect
                                    x="3.5"
                                    y="5"
                                    width="17"
                                    height="16"
                                    rx="3"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                />
                                <path
                                    d="M3.5 10h17"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                />
                                <path
                                    d="M8 3.5v4M16 3.5v4"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                />
                            </svg>
                            <span
                                class="absolute inset-x-0 bottom-0.5 text-center text-[11px] font-bold leading-none"
                            >
                                {day}
                            </span>
                        </span>
                    {:else if item.id === "poster"}
                        <svg
                            viewBox="0 0 24 24"
                            class="size-6"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 14v7"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                            />
                            <path
                                d="M8.2 3.8h7.6l.9 6.2a4.7 4.7 0 1 1-9.4 0l.9-6.2Z"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linejoin="round"
                            />
                        </svg>
                    {:else}
                        <svg
                            viewBox="0 0 24 24"
                            class="size-6"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                stroke-width="1.8"
                            />
                            <path
                                d="M12 3.5v2.2M12 18.3v2.2M4.9 6.4l1.6 1.6M17.5 16l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.6l1.6-1.6M17.5 8l1.6-1.6"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                            />
                        </svg>
                    {/if}
                    <span
                        class="max-w-full truncate text-[10px] font-bold tracking-wide"
                    >
                        {item.label}
                    </span>
                </button>
            </li>
        {/each}
    </ul>
</nav>
