import React, { useState } from "react";

import "./ScoreButton.scss";
import { useAllTeam } from "../../hooks/teamHooks";
import { Modal } from "../Modal/Modal";
import classNames from "classnames";
import { useBoard } from "../../hooks/boardHooks";
import { useRounds } from "../../hooks/roundHooks";

interface Props {
  categoryId: string;
  score: number;
  categoryName: string;
}

export function ScoreButton(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categoryId, score, categoryName } = props;
  const tileId = `${categoryId}-${score}`;

  const { teams } = useAllTeam();
  const { usedTiles } = useBoard();
  const { completeRound } = useRounds();
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
        onClick={() => setIsModalOpen(true)}
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
          <div className="score-dialog">
            {/* Dialogen gir fokus hit, så et ekstra Enter-trykk ikke gir poeng. */}
            <p className="score-dialog__question" tabIndex={-1}>
              {teams.length > 0
                ? "Hvem gjettet riktig?"
                : "Ingen lag er lagt til ennå."}
            </p>
            <div className="score-dialog__teams">
              {teams.map((team) => (
                <button
                  type="button"
                  className="pill-button pill-button--primary score-dialog__button"
                  onClick={() => finish(team.name)}
                  key={team.name}
                >
                  {team.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="pill-button pill-button--secondary score-dialog__button"
              onClick={() => finish(null)}
            >
              Ingen gjettet riktig
            </button>
          </div>
        </Modal>
      )}
    </>
  );

  function finish(teamName: string | null) {
    completeRound({ tileId, categoryId, score, teamName });
    setIsModalOpen(false);
  }
}
