import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "@/App";
import { store } from "@/store";
import { LoadingProvider } from "./providers/LoadingProvider";
import { rehydratePostersCache } from "./utils/rehydrateCache";

// Register custom service worker for posters API caching
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "service-worker.js")
      .catch(() => {});
  });
}

// Rehydrate RTK Query cache from service worker cache
rehydratePostersCache(store.dispatch).catch(() => {});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </Provider>
  </StrictMode>
);
