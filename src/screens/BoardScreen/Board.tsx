import React from "react";
import { CATEGORY_IDS, SCORES, toCategoryName } from "../../game/categories";
import { useBoard } from "../../hooks/boardHooks";
import { Tile } from "./Tile";

interface Props {
  onLastTileUsed: () => void;
}

export function Board(props: Props) {
  const { onLastTileUsed } = props;
  const { categoryNames } = useBoard();

  return (
    <div className="board">
      {CATEGORY_IDS.map((categoryId) => {
        const name = toCategoryName(categoryNames, categoryId);
        return (
          <div
            className="board__category"
            role="group"
            aria-label={name}
            key={categoryId}
          >
            <h2 className="board__name">{name}</h2>
            {SCORES.map((score) => (
              <Tile
                categoryId={categoryId}
                categoryName={name}
                score={score}
                onLastTileUsed={onLastTileUsed}
                key={score}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
