import js from "@eslint/js";
import globals from "globals";
import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".astro/**",
      ".agents/**",
      "node_modules/**",
      "data/**",
      "logs/**",
      "junit.xml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,astro,svelte}"],
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.bun,
        Bun: "readonly",
      },
    },
  },
);
