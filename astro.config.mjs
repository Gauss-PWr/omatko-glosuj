// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import bun from "@igloczek/astro-bun-adapter";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Served by the omatko.pwr.edu.pl reverse proxy under /glosuj/.
  base: "/glosuj",
  output: "server",
  adapter: bun({ mode: "standalone" }),
  integrations: [svelte()],

  vite: {
    envPrefix: ["PUBLIC_", "DATABASE_"],
    plugins: [tailwindcss()],
  },
});
