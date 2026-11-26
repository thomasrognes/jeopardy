import React from "react";

import "./BoardScreen.scss";
import type { Screen } from "../../App";
import { useSelectedGame } from "../../game/useSelectedGame";
import { useGame } from "../../hooks/gameHooks";
import { Board } from "./Board";
import { GameMenu } from "./GameMenu";
import { Scoreboard } from "./Scoreboard";
import { UndoToast } from "./UndoToast";

interface Props {
  onNavigate: (screen: Screen) => void;
}

export function BoardScreen(props: Props) {
  const { onNavigate } = props;
  const [selectedGame] = useSelectedGame();
  const { remainingTiles } = useGame();
  const remaining =
    remainingTiles === 1 ? "1 rute igjen" : `${remainingTiles} ruter igjen`;

  return (
    <div className="play">
      <header className="play__header">
        <div className="play__heading">
          <h1 className="wordmark play__title">Jeopardy</h1>
          <p className="muted">
            {selectedGame ? `${selectedGame.name} · ${remaining}` : remaining}
          </p>
        </div>
        <GameMenu selectedGame={selectedGame} onNavigate={onNavigate} />
      </header>

      <main className="play__board">
        <Board />
      </main>

      <footer className="play__footer">
        <div className="play__status">
          <UndoToast />
          {remainingTiles === 0 && (
            <button
              type="button"
              className="button button--primary"
              onClick={() => onNavigate("result")}
            >
              Kår vinner
            </button>
          )}
        </div>
        <Scoreboard />
      </footer>
    </div>
  );
}
