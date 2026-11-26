import React, { useId, useState } from "react";

import "./SetupScreen.scss";
import type { Screen } from "../../App";
import { ConfirmDialog } from "../../components/ConfirmDialog/ConfirmDialog";
import { useGame } from "../../hooks/gameHooks";
import { useAllTeam } from "../../hooks/teamHooks";
import { useSelectedGame } from "../../game/useSelectedGame";
import { CategoryFields } from "./CategoryFields";
import { GamePicker } from "./GamePicker";
import { TeamList } from "./TeamList";

interface Props {
  onNavigate: (screen: Screen) => void;
}

export function SetupScreen(props: Props) {
  const { onNavigate } = props;
  const { teams } = useAllTeam();
  const { isInProgress, startNewGame } = useGame();
  const [selectedGame, selectGame] = useSelectedGame();
  const [isConfirmingNewGame, setIsConfirmingNewGame] = useState(false);

  const summaryId = useId();

  const hasTeams = teams.length > 0;
  const teamCount = `${teams.length} lag`;
  const summary = selectedGame
    ? `${selectedGame.name} · ${teamCount}`
    : teamCount;

  return (
    <div className="setup">
      <header className="setup__header">
        <h1 className="wordmark setup__title">Jeopardy</h1>
        <p className="muted">
          Gjør klart spillet, og start når alle er på plass.
        </p>
      </header>

      <main className="setup__columns">
        <section className="setup__panel" aria-labelledby="setup-game">
          <h2 id="setup-game">1. Velg spill</h2>
          <GamePicker selectedGame={selectedGame} onSelect={selectGame} />
        </section>
        <section className="setup__panel" aria-labelledby="setup-categories">
          <h2 id="setup-categories">2. Kategorier</h2>
          <CategoryFields />
        </section>
        <section className="setup__panel" aria-labelledby="setup-teams">
          <h2 id="setup-teams">3. Lag</h2>
          <TeamList />
        </section>
      </main>

      <div className="setup__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={() => onNavigate("board")}
          disabled={!hasTeams}
          aria-describedby={summaryId}
        >
          {isInProgress ? "Fortsett spillet" : "Start spillet"}
        </button>
        <p id={summaryId} className="muted">
          {hasTeams ? summary : "Legg til minst ett lag for å starte."}
        </p>
        {isInProgress && (
          <button
            type="button"
            className="button button--quiet"
            onClick={() => setIsConfirmingNewGame(true)}
          >
            Nytt spill
          </button>
        )}
      </div>

      {isConfirmingNewGame && (
        <ConfirmDialog
          title="Nytt spill"
          message="Poeng og brukte ruter nullstilles. Lagene og kategoriene beholdes."
          confirmLabel="Start på nytt"
          onCancel={() => setIsConfirmingNewGame(false)}
          onConfirm={() => {
            startNewGame();
            setIsConfirmingNewGame(false);
          }}
        />
      )}
    </div>
  );
}
