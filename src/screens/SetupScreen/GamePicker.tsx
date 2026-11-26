import React from "react";
import classNames from "classnames";
import gameInfo from "../../json/gameInfo.json";

interface Props {
  selectedGame: (typeof gameInfo)[number] | undefined;
  onSelect: (gameId: number | null) => void;
}

export function GamePicker(props: Props) {
  const { selectedGame, onSelect } = props;

  return (
    <>
      {gameInfo.map((game) => {
        const isSelected = game.id === selectedGame?.id;
        return (
          <button
            type="button"
            className={classNames("game-card", {
              "game-card--selected": isSelected,
            })}
            aria-pressed={isSelected}
            // Et nytt trykk på det valgte spillet fjerner valget.
            onClick={() => onSelect(isSelected ? null : game.id)}
            key={game.id}
          >
            {game.name}
          </button>
        );
      })}

      {selectedGame && (
        <div className="setup__links">
          <a href={selectedGame.googleDocLink} target="_blank" rel="noreferrer">
            Åpne fasit
          </a>
          <a href={selectedGame.spotifyLink} target="_blank" rel="noreferrer">
            Åpne spilleliste
          </a>
          <p className="muted">Kategoriene må skrives inn selv.</p>
        </div>
      )}
    </>
  );
}
