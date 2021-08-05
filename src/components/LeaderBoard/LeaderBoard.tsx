import React, { useState } from "react";
import { useAllTeam } from "../../hooks/teamHooks";

import "./LeaderBoard.scss";
import { LeaderBoardRow } from "./LeaderBoardRow";
import { AddTeamModal } from "../../AddTeamModal/AddTeamModal";

export function LeaderBoard() {
  const { teams } = useAllTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="leader-board">
      {teams.length > 0 && (
        <table className="leader-board__table">
          <thead>
            <tr className="leader-board__table-headings">
              <th>Plassering</th>
              <th>Lagnavn</th>
              <th>Poeng</th>
            </tr>
          </thead>
          <tbody>
            {teams
              .sort((a, b) => b.score - a.score)
              .map((team, index) => (
                <LeaderBoardRow
                  placement={index + 1}
                  teamName={team.name}
                  score={team.score}
                  key={index}
                />
              ))}
          </tbody>
        </table>
      )}

      <button
        className="remove-button-style leader-board__button"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        Legg til nytt lag
      </button>

      {isModalOpen && (
        <AddTeamModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      ) }
    </div>
  );
}
