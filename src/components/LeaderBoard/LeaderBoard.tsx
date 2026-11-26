import React, { useState } from "react";
import { useAllTeam } from "../../hooks/teamHooks";

import "./LeaderBoard.scss";
import { LeaderBoardRow } from "./LeaderBoardRow";
import { AddTeamModal } from "../../AddTeamModal/AddTeamModal";
import { EditTeamModal } from "../EditTeamModal/EditTeamModal";

export function LeaderBoard() {
  const { teams } = useAllTeam();
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<string | null>(null);
  return (
    <div className="leader-board">
      {teams.length > 0 && (
        <table className="leader-board__table">
          <thead>
            <tr className="leader-board__table-headings">
              <th aria-label="Plassering">#</th>
              <th>Lagnavn</th>
              <th>Poeng</th>
            </tr>
          </thead>
          <tbody>
            {rankedTeams.map((team, index) => (
              <LeaderBoardRow
                // Lag med like mange poeng deler den beste plassen.
                placement={
                  rankedTeams.findIndex((other) => other.score === team.score) +
                  1
                }
                teamName={team.name}
                score={team.score}
                onEdit={() => setTeamToEdit(team.name)}
                key={index}
              />
            ))}
          </tbody>
        </table>
      )}

      <button
        className="pill-button leader-board__button"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        Legg til nytt lag
      </button>

      {isModalOpen && <AddTeamModal setIsModalOpen={setIsModalOpen} />}

      {teamToEdit !== null && (
        <EditTeamModal
          teamName={teamToEdit}
          onClose={() => setTeamToEdit(null)}
        />
      )}
    </div>
  );
}
