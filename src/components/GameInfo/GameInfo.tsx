import React from "react";
import gameInfo from "../../json/gameInfo.json";
import { usePersistedState } from "../../hooks/usePersistedState";

import "./GameInfo.scss";

interface GameInfoType {
  id: number;
  name: string;
  googleDocLink: string;
  spotifyLink: string;
}

function isGameId(value: unknown): value is number | null {
  return typeof value === "number" || value === null;
}

export function GameInfo() {
  const [currentGameInfo, setCurrentGameInfo] = usePersistedState<
    number | null
  >("jeopardy.gameId", null, isGameId);

  const gameInfoToShow: GameInfoType | undefined = gameInfo.find(
    (game) => game.id === currentGameInfo
  );

  return (
    <div className="game-info">
      <label htmlFor="teams">Velg spill</label>
      <select
        className="select-component-input"
        name="teams"
        id="teams"
        value={gameInfoToShow?.id ?? ""}
        onChange={(e) =>
          setCurrentGameInfo(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="" />
        {gameInfo.map((game, index) => (
          <option value={game.id} key={index}>
            {game.name}
          </option>
        ))}
      </select>

      {gameInfoToShow && (
        <div className="game-info__links">
          <span>
            <b>NB! Kategoriene må endres manuelt.</b>
          </span>
          <a
            href={gameInfoToShow.googleDocLink}
            target={"_blank"}
            rel="noreferrer"
          >
            Fasit (Google docs)
          </a>
          <a
            href={gameInfoToShow.spotifyLink}
            target={"_blank"}
            rel="noreferrer"
          >
            Sanger (Spotify)
          </a>
        </div>
      )}
    </div>
  );
}
