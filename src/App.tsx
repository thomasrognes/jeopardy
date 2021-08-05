import React from "react";
import "./App.scss";
import "./utilities/utilities.scss";
import { Board } from "./components/Board/Board";
import { Header } from "./components/Header/Header";
import { LeaderBoard } from "./components/LeaderBoard/LeaderBoard";

export function App() {
  return (
    <div className="App">
      <Header />
      <Board />
      <LeaderBoard />
    </div>
  );
}

export default App;
