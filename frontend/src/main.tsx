import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "@/App";
import { store } from "@/store";
import { LoadingProvider } from "./providers/LoadingProvider";
import { rehydrateVotesCache, setupVotesPersistence } from "./utils/rehydrateCache";

// Rehydrate votes cache from localStorage on startup
rehydrateVotesCache(store.dispatch);

// Persist votes to localStorage when they change
setupVotesPersistence(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </Provider>
  </StrictMode>
);
