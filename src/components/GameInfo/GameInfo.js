import React, { useState } from "react";
import gameInfo from "../../json/gameInfo.json";

import "./GameInfo.css";

export function GameInfo() {
  const [currentGameInfo, setCurrentGameInfo] = useState();

  const gameInfoToShow = gameInfo.find((game) => game.id === currentGameInfo);

  return (
    <div className="game-info">
      <label htmlFor="teams">Velg spill</label>
      <select
        className="select-component-input"
        name="teams"
        id="teams"
        onChange={(e) => setCurrentGameInfo(parseInt(e.target.value))}
      >
        <option value={undefined} />
        {gameInfo.map((game, index) => (
          <option value={game.id} key={index}>
            {game.name}
          </option>
        ))}
      </select>

      {gameInfoToShow && (
        <div className="game-info-links">
          <span className="error">Ikke vis info som ligger på linkene til deltakere</span>
          <span>Navn: {gameInfoToShow.name}</span>
          <span>
            Google doc link:{" "}
            <a
              href={gameInfoToShow.googleDocLink}
              target={"_blank"}
              rel="noreferrer"
            >
              Fasit (Google docs)
            </a>
          </span>
          <span>
            Spotify link:{" "}
            <a
              href={gameInfoToShow.spotifyLink}
              target={"_blank"}
              rel="noreferrer"
            >
              Sanger (Spotify)
            </a>
          </span>
          <span>Creator: {gameInfoToShow.author}</span>
        </div>
      )}
    </div>
  );
}
