<script lang="ts">
    import { onMount } from "svelte";
    import { actions } from "astro:actions";
    import logo from "../assets/logo.webp";

    let pending = $state(false);
    let darkMode = $state(false);

    onMount(() => {
        darkMode = document.documentElement.classList.contains("dark");
    });

    function toggleTheme() {
        darkMode = !darkMode;
        document.documentElement.classList.toggle("dark", darkMode);
        try {
            localStorage.setItem("omatko-theme", darkMode ? "dark" : "light");
        } catch {}
    }

    async function logout() {
        if (pending) return;
        pending = true;
        await actions.logout();
        window.location.assign("/login");
    }
</script>

<article
    class="theme-surface w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700"
>
    <h2 class="text-lg font-semibold">Ustawienia</h2>
    <label
        class="mt-5 flex cursor-pointer items-center justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-700"
    >
        <span>
            <span class="block text-sm font-semibold">Tryb ciemny</span>
            <span class="block text-xs text-zinc-500 dark:text-zinc-400"
                >Zapisz wygląd na tym urządzeniu</span
            >
        </span>
        <span class="relative inline-flex h-7 w-12 shrink-0 items-center">
            <input
                type="checkbox"
                class="peer sr-only"
                checked={darkMode}
                onchange={toggleTheme}
                aria-label="Włącz tryb ciemny"
            />
            <span
                class="h-7 w-12 rounded-full bg-zinc-300 transition-colors duration-200 peer-checked:bg-o-blue dark:bg-zinc-700 peer-checked:dark:bg-o-blue"
            ></span>
            <span
                class="absolute left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5"
            ></span>
        </span>
    </label>
    <section
        aria-labelledby="event-information"
        class="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700"
    >
        <img
            src={logo.src}
            alt="OMatKo!!!"
            width={logo.width}
            height={logo.height}
            class="mb-4 h-auto w-full max-w-64 object-contain object-left"
        />
        <h3 id="event-information" class="text-sm font-semibold">
            Informacje o wydarzeniu
        </h3>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            XIII Ogólnopolska Matematyczna Konferencja Studentów „OMatKo!!!”
        </p>
        <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            11–13 grudnia 2026
        </p>
        <a
            class="mt-2 inline-block text-sm font-semibold text-o-blue underline-offset-4 hover:underline"
            href="https://omatko.pwr.edu.pl/"
            target="_blank"
            rel="noreferrer"
        >
            omatko.pwr.edu.pl
        </a>
    </section>
    <button
        type="button"
        disabled={pending}
        class="mt-6 w-full rounded-lg bg-o-orange px-4 py-2.5 text-sm font-bold text-white transition-[background-color,transform] duration-150 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60"
        onclick={logout}
    >
        Wyloguj się
    </button>
</article>
