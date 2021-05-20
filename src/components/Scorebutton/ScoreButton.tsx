import React, { useState } from "react";

import "./ScoreButton.scss";
import { useAllTeam } from "../../hooks/teamHooks";
import { Modal } from "../Modal/Modal";
import classNames from "classnames";

interface Props {
  score: number;
  categoryName: string;
}

export function ScoreButton(props: Props) {
  const [winnerTeam, setWinnerTeam] = useState<string>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOnlyWrongAnswers, setIsOnlyWrongAnswers] = useState(false);
  const { score, categoryName } = props;

  const { teams, setTeams } = useAllTeam();

  const classNamesForScoreButton = classNames({
    "score-button": true,
    "score-button__disabled": isDisabled,
    "score-button__not-disabled": !isDisabled,
  });

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
                // value={isOnlyWrongAnswers}
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

  function addScore() {
    if (isOnlyWrongAnswers) {
      setIsModalOpen(false);
      return;
    }

    if (winnerTeam === undefined) {
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

    setIsModalOpen(false);
  }
}
