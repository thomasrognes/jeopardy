import React, { useRef, useState } from "react";
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
  const editButtonRef = useRef<HTMLButtonElement>(null);
  // `name` er standardnavnet, og brukes også som fast id for kategorien.
  const typedName = categoryNames[name] ?? name;
  const categoryName = typedName.trim() || name;

  return (
    <div className="category" role="group" aria-label={categoryName}>
      <div className="category__name">
        {editing ? (
          <form
            className="category__name-form"
            onSubmit={(e) => {
              e.preventDefault();
              finishEditing();
              editButtonRef.current?.focus();
            }}
          >
            <input
              value={typedName}
              onChange={(e) => setCategoryName(name, e.target.value)}
              onFocus={(e) => e.target.select()}
              className="category__name-input"
              aria-label="Kategorinavn"
              autoFocus
            />
          </form>
        ) : (
          <h2>{categoryName}</h2>
        )}
        <button
          ref={editButtonRef}
          type="button"
          onClick={() => (editing ? finishEditing() : setEditing(true))}
          className="remove-button-style"
          aria-label="Rediger kategorinavn"
        >
          <EditPen />
        </button>
      </div>
      <ScoreButton categoryId={name} score={100} categoryName={categoryName} />
      <ScoreButton categoryId={name} score={200} categoryName={categoryName} />
      <ScoreButton categoryId={name} score={300} categoryName={categoryName} />
      <ScoreButton categoryId={name} score={400} categoryName={categoryName} />
      <ScoreButton categoryId={name} score={500} categoryName={categoryName} />
    </div>
  );

  function finishEditing() {
    setCategoryName(name, categoryName);
    setEditing(false);
  }
}
