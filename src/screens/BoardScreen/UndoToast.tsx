import React from "react";
import { toCategoryName } from "../../game/categories";
import { useBoard } from "../../hooks/boardHooks";
import { useRounds } from "../../hooks/roundHooks";

export function UndoToast() {
  const { categoryNames } = useBoard();
  const { lastRound, undoLastRound } = useRounds();

  return (
    // Området finnes hele tiden, så skjermlesere får med seg endringene.
    <div role="status">
      {lastRound && (
        <div className="toast">
          <span>
            {lastRound.teamName === null
              ? `Ingen poeng for ${categoryName()} ${lastRound.score}`
              : `${lastRound.teamName} fikk ${lastRound.score} poeng`}
          </span>
          <button
            type="button"
            className="toast__undo"
            onClick={undoLastRound}
            aria-label={`Angre: ${categoryName()} ${lastRound.score} – ${
              lastRound.teamName ?? "ingen poeng"
            }`}
          >
            Angre
          </button>
        </div>
      )}
    </div>
  );

  function categoryName() {
    return toCategoryName(categoryNames, lastRound!.categoryId);
  }
}
