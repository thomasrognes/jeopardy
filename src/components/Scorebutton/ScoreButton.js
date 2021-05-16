import React, { useState } from "react";

import "./ScoreButton.css";
import { useAllTeam } from "../../hooks/teamHooks";
import { Modal } from "../Modal/Modal";

export function ScoreButton(props) {
  const [winnerTeam, setWinnerTeam] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { teams, setTeams } = useAllTeam();

  const classNames = require("classnames");
  const classNamesForScoreButton = classNames({
    "score-button": true,
    "score-button-disabled": isDisabled,
    "score-button-not-disabled": !isDisabled,
  });

  const { score, categoryName } = props;

  return (
    <>
      <button
        className={classNamesForScoreButton}
        onClick={() => {
          setIsDisabled(true);
          setIsModalOpen(true);
        }}
        disabled={isDisabled}
      >
        {score}
      </button>
      {isModalOpen && (
        <Modal
          title={`${categoryName} ${score} poeng`}
          hidden={false}
          onDialogToggle={() => {
            setIsModalOpen(!isModalOpen);
            setIsDisabled(false); // Players can make a mistake and pick wrong category or score amount.
          }}
        >
          <div className="select-component">
            <label htmlFor="teams">Velg laget som gjettet korrekt:</label>
            <select
              name="teams"
              id="teams"
              onChange={(e) => setWinnerTeam(e.target.value)}
            >
              <option value="" />
              {teams.map((team, index) => (
                <option value={team.name} key={index}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && <span className="error">{errorMessage}</span>}
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

  function addScore() {
    if (winnerTeam === undefined) {
      setErrorMessage("Påkrevd felt.");
      return;
    }

    const teamToGetPoints = teams.find((team) => team.name === winnerTeam);
    const index = teams.indexOf(teamToGetPoints);

    if (teamToGetPoints === undefined || index === -1) {
      setErrorMessage(
        "Laget finnes ikke.. Be Thomas skjerpe seg og skrive bedre kode for dette skal ikke skje."
      );
      return;
    }

    // Changing the object of the team to update score before adding the new object to teams array
    const teamsArray = [...teams];
    teamsArray[index] = {
      ...teamToGetPoints,
      score: teamToGetPoints.score + score,
    };
    setTeams(teamsArray);

    setIsModalOpen(false);
  }
}