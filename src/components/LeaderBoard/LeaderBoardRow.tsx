import React from "react";

import "./LeaderBoardRow.scss";

interface Props {
  placement: number;
  teamName: string;
  score: number;
}

export function LeaderBoardRow(props: Props) {
  const { placement, teamName, score } = props;
  return (
    <tr className="leader-board-row">
      <td>{placement}</td>
      <td>{teamName}</td>
      <td>{score}</td>
    </tr>
  );
}
