import React from "react";
import { useAllTeam } from "../../hooks/teamHooks";

import "./LeaderBoard.css";
import { LeaderBoardRow } from "./LeaderBoardRow";

export function LeaderBoard(props) {
  const { onCloseClick } = props;
  const { teams } = useAllTeam();

  if (teams.length === 0) {
    return null;
  }

  return (
    <>
      <table className="leader-board">
        <tr className="leader-board-headings">
          <th>Plassering</th>
          <th>Lagnavn</th>
          <th>Poeng</th>
        </tr>
        {teams
          .sort((a, b) => b.score - a.score)
          .map((team, index) => (
            <LeaderBoardRow
              placement={index + 1}
              teamName={team.name}
              score={team.score}
            />
          ))}
      </table>
      {onCloseClick && (
        <button className="leader-board-close-button" onClick={onCloseClick}>
          Lukk
        </button>
      )}
    </>
  );
}
