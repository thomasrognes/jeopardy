import React, { useState } from "react";

import "./ScoreButton.scss";
import { useAllTeam } from "../../hooks/teamHooks";
import { Modal } from "../Modal/Modal";
import classNames from "classnames";
import { useBoard } from "../../hooks/boardHooks";

interface Props {
  tileId: string;
  score: number;
  categoryName: string;
}

export function ScoreButton(props: Props) {
  const [winnerTeam, setWinnerTeam] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOnlyWrongAnswers, setIsOnlyWrongAnswers] = useState(false);
  const { tileId, score, categoryName } = props;

  const { teams, setTeams } = useAllTeam();
  const { usedTiles, markTileAsUsed } = useBoard();
  const isDisabled = usedTiles.includes(tileId);

  const classNamesForScoreButton = classNames({
    "score-button": true,
    "score-button__disabled": isDisabled,
    "score-button__not-disabled": !isDisabled,
  });

  return (
    <>
      <button
        className={classNamesForScoreButton}
        onClick={openModal}
        disabled={isDisabled}
      >
        {score}
      </button>
      {isModalOpen && (
        <Modal
          title={`${categoryName} ${score} poeng`}
          // The tile is not marked as used, since players can pick the wrong one.
          onClose={() => setIsModalOpen(false)}
        >
          <div className="select-component">
            <label htmlFor="teams">Velg laget som gjettet korrekt:</label>
            <select
              className="select-component-input"
              name="teams"
              id="teams"
              onChange={(e) => {
                setErrorMessage("");
                setWinnerTeam(e.target.value);
              }}
            >
              <option value={undefined} />
              {teams.map((team, index) => (
                <option value={team.name} key={index}>
                  {team.name}
                </option>
              ))}
            </select>
            {errorMessage && <span className="error">{errorMessage}</span>}

            <div className="checkbox-component">
              <input
                type={"checkbox"}
                id="noAnswers"
                name="noAnswers"
                checked={isOnlyWrongAnswers}
                onChange={() => setIsOnlyWrongAnswers(!isOnlyWrongAnswers)}
              />
              <label className={"checkbox-component-label"} htmlFor="noAnswers">
                Ingen gjettet riktig.
              </label>
            </div>
          </div>
          <button
            type="button"
            className="add-points-button"
            onClick={addScore}
          >
            Legg til poeng
          </button>
        </Modal>
      )}
    </>
  );

  function openModal() {
    // Nothing from an earlier, cancelled attempt should carry over.
    setWinnerTeam(undefined);
    setErrorMessage("");
    setIsOnlyWrongAnswers(false);
    setIsModalOpen(true);
  }

  function completeRound() {
    markTileAsUsed(tileId);
    setIsModalOpen(false);
  }

  function addScore() {
    if (isOnlyWrongAnswers) {
      completeRound();
      return;
    }

    if (!winnerTeam) {
      setErrorMessage("Påkrevd felt.");
      return;
    }

    const teamToGetPoints = teams.find((team) => team.name === winnerTeam);

    if (!teamToGetPoints) {
      setErrorMessage("Laget finnes ikke..");
      return;
    }

    const index = teams.indexOf(teamToGetPoints);

    // Changing the object of the team to update score before adding the new object to teams array
    const teamsArray = [...teams];
    teamsArray[index] = {
      ...teamToGetPoints,
      score: teamToGetPoints.score + score,
    };
    setTeams(teamsArray);

    completeRound();
  }
}
