import React from "react";
import { useAllTeam } from "../../hooks/teamHooks";

import "./LeaderBoard.scss";
import { LeaderBoardRow } from "./LeaderBoardRow";

export function LeaderBoard() {
  const { teams } = useAllTeam();

  if (teams.length === 0) {
    return null;
  }

  return (
    <>
      <table className="leader-board">
        <thead>
          <tr className="leader-board__headings">
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
    </>
  );
}
