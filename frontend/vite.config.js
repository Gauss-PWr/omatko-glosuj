import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  // single host: VITE_API_HOST=omatko.pwr.edu.pl
  // or multiple comma-separated: VITE_API_HOSTS=omatko.pwr.edu.pl,api.example.com
  const hosts = (env.VITE_APP_API_BASE_URL || "http://omatko.pwr.edu.pl")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean)
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // escape
    .join("|");

  const votePattern = new RegExp(`^(?:${hosts})\\/.*\\/vote(\\/.*)?`, "i");
  const dataPattern = new RegExp(`^(?:${hosts})\\/(posters|lectures)$`, "i");
  const authPattern = new RegExp(`^(?:${hosts})\\/auth\\/.*`, "i");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "robots.txt",
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "apple-touch-icon.png",
          "favicon-16x16.png",
          "favicon-32x32.png",
        ],
        manifest: {
          name: "OMatKo!!! Głosuj",
          short_name: "Głosuj",
          description: "Głosowanie na wykłady i plakaty",
          theme_color: "#4CAF50",
          id: "/glosuj/",
          icons: [
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,webp,woff,woff2}"],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: votePattern,
              handler: "NetworkFirst",
              method: "POST",
              options: {
                cacheName: "vote-cache",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 0, // 5 minutes
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: votePattern,
              handler: "NetworkFirst",
              method: "PUT",
              options: {
                cacheName: "vote-cache",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 0, // 5 minutes
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: dataPattern,
              handler: "CacheFirst",
              method: "GET",
              options: {
                cacheName: "data-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: authPattern,
              handler: "NetworkFirst",
              options: {
                cacheName: "auth-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 5, // 5 minutes
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    base: "/glosuj/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
