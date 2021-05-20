import React from "react";
import "./App.scss";
import "./utilities/utilities.scss";
import { Board } from "./components/Board/Board";
import { Header } from "./components/Header/Header";

export function App() {
  return (
    <div className="App">
      <Header />
      <Board />
    </div>
  );
}

export default App;
