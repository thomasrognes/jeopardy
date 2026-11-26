import React from "react";

import "./AwardDialog.scss";
import { Modal } from "../../components/Modal/Modal";
import { teamColor } from "../../game/teams";
import { useAllTeam } from "../../hooks/teamHooks";

interface Props {
  categoryName: string;
  score: number;
  onClose: () => void;
  // null når ingen svarte riktig
  onAward: (teamName: string | null) => void;
}

export function AwardDialog(props: Props) {
  const { categoryName, score, onClose, onAward } = props;
  const { teams } = useAllTeam();

  return (
    <Modal
      fullscreen
      onClose={onClose}
      title={
        <>
          <span className="award__category">{categoryName}</span>{" "}
          <span className="award__score">{score}</span>
        </>
      }
    >
      <p className="award__question">Hvem svarte riktig?</p>
      <div className="award__teams">
        {teams.map((team, index) => (
          <button
            type="button"
            className="award__team"
            style={{ backgroundColor: teamColor(team, index) }}
            onClick={() => onAward(team.name)}
            key={team.name}
          >
            {team.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="button button--outline"
        onClick={() => onAward(null)}
      >
        Ingen svarte riktig
      </button>
    </Modal>
  );
}
