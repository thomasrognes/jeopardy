import React, { useState } from "react";

import "./ResultScreen.scss";
import type { Screen } from "../../App";
import { ConfirmDialog } from "../../components/ConfirmDialog/ConfirmDialog";
import { rankTeams } from "../../game/teams";
import { useGame } from "../../hooks/gameHooks";
import { useAllTeam } from "../../hooks/teamHooks";

interface Props {
  onNavigate: (screen: Screen) => void;
}

export function ResultScreen(props: Props) {
  const { onNavigate } = props;
  const { teams } = useAllTeam();
  const { startNewGame } = useGame();
  const [isConfirmingNewGame, setIsConfirmingNewGame] = useState(false);

  const ranked = rankTeams(teams);
  const winners = ranked.filter((entry) => entry.placement === 1);
  const hasWinner = winners.length > 0 && winners[0].team.score > 0;
  const podium = ranked.slice(0, 3);
  const others = ranked.slice(3);

  return (
    <div className="result">
      <header className="result__header">
        {hasWinner && (
          <p className="result__eyebrow">
            {winners.length > 1 ? "Vinnerne er" : "Vinneren er"}
          </p>
        )}
        <h1 className="result__winner">
          {hasWinner
            ? joinNames(winners.map((entry) => entry.team.name))
            : "Ingen vinner ennå"}
        </h1>
      </header>

      {hasWinner && (
        <>
          <ol className="podium" aria-label="Seierspall">
            {podium.map(({ team, color, placement }) => (
              <li className="podium__place" key={team.name}>
                <span className="podium__name">{team.name}</span>
                <div
                  className={`podium__block podium__block--${placement}`}
                  style={{ backgroundColor: color }}
                >
                  <span className="podium__placement">{placement}</span>
                  <span className="podium__score">{team.score}</span>
                </div>
              </li>
            ))}
          </ol>
          {others.length > 0 && (
            <ul className="result__others" aria-label="Øvrige lag">
              {others.map(({ team, placement }) => (
                <li key={team.name}>
                  {placement}. {team.name} · {team.score} poeng
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div className="result__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={() => setIsConfirmingNewGame(true)}
        >
          Nytt spill
        </button>
        <button
          type="button"
          className="button button--quiet"
          onClick={() => onNavigate("board")}
        >
          Tilbake til brettet
        </button>
      </div>

      {isConfirmingNewGame && (
        <ConfirmDialog
          title="Nytt spill"
          message="Poeng og brukte ruter nullstilles. Lagene og kategoriene beholdes."
          confirmLabel="Start på nytt"
          onCancel={() => setIsConfirmingNewGame(false)}
          onConfirm={() => {
            startNewGame();
            onNavigate("setup");
          }}
        />
      )}
    </div>
  );
}

// «A», «A og B», «A, B og C»
function joinNames(names: string[]) {
  const last = names[names.length - 1];
  return names.length > 1
    ? `${names.slice(0, -1).join(", ")} og ${last}`
    : last;
}
