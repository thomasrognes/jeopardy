import React from "react";
import { useBoard } from "../../hooks/boardHooks";
import { useRounds } from "../../hooks/roundHooks";
import { MenuButton } from "../MenuButton/MenuButton";

export function UndoButton() {
  const { categoryNames } = useBoard();
  const { lastRound, undoLastRound } = useRounds();

  if (!lastRound) {
    return null;
  }

  const { categoryId, score, teamName } = lastRound;
  const categoryName = categoryNames[categoryId]?.trim() || categoryId;

  return (
    <MenuButton
      title={`Angre: ${categoryName} ${score} – ${teamName ?? "ingen poeng"}`}
      onClick={undoLastRound}
    />
  );
}
