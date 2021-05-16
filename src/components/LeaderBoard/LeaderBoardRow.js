import React from "react";

import "./LeaderBoardRow.css";

export function LeaderBoardRow(props) {
  const { placement, teamName, score } = props;
  return (
    <tr className="leader-board-row">
      <td>{placement}</td>
      <td>{teamName}</td>
      <td>{score}</td>
    </tr>
  );
}
