/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default getViteConfig({
  resolve: {
    alias: {
      $lib: `${src}/lib`,
      $db: `${src}/db`,
      $components: `${src}/components`,
    },
  },
  ssr: {
    external: ["bun:sqlite"],
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,js}"],
    exclude: ["dist", "node_modules"],
    server: {
      deps: {
        external: ["bun:sqlite"],
      },
    },
  },
});
