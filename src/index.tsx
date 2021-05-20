import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TeamsContextProvider } from "./context/TeamContext";

ReactDOM.render(
  <React.StrictMode>
    <TeamsContextProvider>
      <App />
    </TeamsContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
