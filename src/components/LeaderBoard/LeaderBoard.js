import React from "react";
import { useAllTeam } from "../../hooks/teamHooks";

import "./LeaderBoard.css";

export function LeaderBoard() {
  const { teams } = useAllTeam();

  return (
    <div className="leader-board">
      <h1>Tabell</h1>
      {teams.map((team) => (
        <div>
          {team.name} {team.score}
        </div>
      ))}
    </div>
  );
}
