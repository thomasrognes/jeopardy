import "./App.css";
import { Board } from "./components/Board/Board";

function App() {
  var classNames = require("classnames");
  return (
    <div className="App">
      <h1>Jeopardy</h1>
      <Board />
    </div>
  );
}

export default App;
