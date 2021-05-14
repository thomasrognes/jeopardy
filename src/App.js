import "./App.css";
import { Board } from "./components/Board/Board";
import { Header } from "./components/Header/Header";
import { LeaderBoard } from "./components/LeaderBoard/LeaderBoard";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-content">
        <LeaderBoard />
        <Board />
      </div>
    </div>
  );
}

export default App;
