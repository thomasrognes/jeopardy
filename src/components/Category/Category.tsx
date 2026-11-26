import React, { useState } from "react";
import { ScoreButton } from "../Scorebutton/ScoreButton";

import "./Category.scss";
import { EditPen } from "../EditPen/EditPen";
import { useBoard } from "../../hooks/boardHooks";

interface Props {
  name: string;
}

export function Category(props: Props) {
  const { name } = props;

  const [editing, setEditing] = useState(false);
  const { categoryNames, setCategoryName } = useBoard();
  // `name` er standardnavnet, og brukes også som fast id for kategorien.
  const categoryName = categoryNames[name] ?? name;

  return (
    <div className="category">
      <div className="category__name">
        {editing ? (
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(name, e.target.value)}
            className="category__name-input"
          />
        ) : (
          <h2>{categoryName}</h2>
        )}
        <button
          onClick={() => setEditing(!editing)}
          className="remove-button-style"
        >
          <EditPen />
        </button>
      </div>
      <ScoreButton
        tileId={`${name}-100`}
        score={100}
        categoryName={categoryName}
      />
      <ScoreButton
        tileId={`${name}-200`}
        score={200}
        categoryName={categoryName}
      />
      <ScoreButton
        tileId={`${name}-300`}
        score={300}
        categoryName={categoryName}
      />
      <ScoreButton
        tileId={`${name}-400`}
        score={400}
        categoryName={categoryName}
      />
      <ScoreButton
        tileId={`${name}-500`}
        score={500}
        categoryName={categoryName}
      />
    </div>
  );
}
