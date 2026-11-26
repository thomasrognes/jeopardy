import React from "react";

import "./LeaderBoardRow.scss";
import { EditPen } from "../EditPen/EditPen";

interface Props {
  placement: number;
  teamName: string;
  score: number;
  onEdit: () => void;
}

export function LeaderBoardRow(props: Props) {
  const { placement, teamName, score, onEdit } = props;
  return (
    <tr className="leader-board-row">
      <td>{placement}</td>
      <td>
        {teamName}
        <button
          type="button"
          className="remove-button-style leader-board-row__edit"
          onClick={onEdit}
          aria-label={`Rediger ${teamName}`}
        >
          <EditPen />
        </button>
      </td>
      <td>{score}</td>
    </tr>
  );
}
