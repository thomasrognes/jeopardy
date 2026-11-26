import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TeamsContextProvider } from "./context/TeamContext";
import { BoardContextProvider } from "./context/BoardContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TeamsContextProvider>
      <BoardContextProvider>
        <App />
      </BoardContextProvider>
    </TeamsContextProvider>
  </React.StrictMode>
);
