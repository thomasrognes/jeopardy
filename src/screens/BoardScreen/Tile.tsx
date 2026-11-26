import React, { useState } from "react";
import { toTileId } from "../../game/categories";
import { useBoard } from "../../hooks/boardHooks";
import { useGame } from "../../hooks/gameHooks";
import { useRounds } from "../../hooks/roundHooks";
import { AwardDialog } from "./AwardDialog";

interface Props {
  categoryId: string;
  categoryName: string;
  score: number;
  // Kalles når den siste ledige ruten er brukt opp.
  onLastTileUsed: () => void;
}

export function Tile(props: Props) {
  const { categoryId, categoryName, score, onLastTileUsed } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { usedTiles } = useBoard();
  const { completeRound } = useRounds();
  const { remainingTiles } = useGame();
  const tileId = toTileId(categoryId, score);
  const isUsed = usedTiles.includes(tileId);

  return (
    <>
      {/* En brukt rute står tom, men har fortsatt et navn for skjermlesere. */}
      <button
        type="button"
        className="tile"
        onClick={() => setIsOpen(true)}
        disabled={isUsed}
        aria-label={isUsed ? `${score}, brukt` : undefined}
      >
        {isUsed ? null : <span className="tile__value">{score}</span>}
      </button>
      {isOpen && (
        <AwardDialog
          categoryName={categoryName}
          score={score}
          // Ruten brukes ikke opp, så man kan gå tilbake hvis man valgte feil.
          onClose={() => setIsOpen(false)}
          onAward={(teamName) => {
            completeRound({ tileId, categoryId, score, teamName });
            setIsOpen(false);
            if (remainingTiles === 1) {
              onLastTileUsed();
            }
          }}
        />
      )}
    </>
  );
}
