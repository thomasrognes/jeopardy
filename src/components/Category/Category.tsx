import React, { useState } from "react";
import { ScoreButton } from "../Scorebutton/ScoreButton";

import "./Category.scss";
import { EditPen } from "../EditPen/EditPen";

interface Props {
  name: string;
}

export function Category(props: Props) {
  const { name } = props;

  const [categoryName, setCategoryName] = useState(name);
  const [editing, setEditing] = useState(false);

  return (
    <div className="category">
      <div className="category__name">
        {editing ? (
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
      <ScoreButton score={100} categoryName={categoryName} />
      <ScoreButton score={200} categoryName={categoryName} />
      <ScoreButton score={300} categoryName={categoryName} />
      <ScoreButton score={400} categoryName={categoryName} />
      <ScoreButton score={500} categoryName={categoryName} />
    </div>
  );
}
