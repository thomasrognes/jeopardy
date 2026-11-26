import React from "react";
import "./styles/global.scss";
import "./styles/buttons.scss";
import { useAllTeam } from "./hooks/teamHooks";
import { usePersistedState } from "./hooks/usePersistedState";
import { BoardScreen } from "./screens/BoardScreen/BoardScreen";
import { ResultScreen } from "./screens/ResultScreen/ResultScreen";
import { SetupScreen } from "./screens/SetupScreen/SetupScreen";

export type Screen = "setup" | "board" | "result";

function isScreen(value: unknown): value is Screen {
  return value === "setup" || value === "board" || value === "result";
}

export function App() {
  const [screen, setScreen] = usePersistedState<Screen>(
    "jeopardy.screen",
    "setup",
    isScreen
  );
  const { teams } = useAllTeam();

  // Uten lag er det ikke noe spill. Skjermen settes tilbake, så man ikke
  // hopper til brettet idet det første laget legges til.
  if (screen !== "setup" && teams.length === 0) {
    setScreen("setup");
  }

  if (screen === "board") {
    return <BoardScreen onNavigate={setScreen} />;
  }
  if (screen === "result") {
    return <ResultScreen onNavigate={setScreen} />;
  }
  return <SetupScreen onNavigate={setScreen} />;
}

export default App;
