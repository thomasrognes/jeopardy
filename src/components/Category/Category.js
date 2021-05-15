import React, { useState } from "react";
import { ScoreButton } from "../Scorebutton/ScoreButton";

import "./Category.css";

export function Category(props) {
  const { name } = props;

  const [categoryName, setCategoryName] = useState(name);

  return (
    <div className="category">
      <h2>{categoryName}</h2>
      <ScoreButton score={100} categoryName={categoryName} />
      <ScoreButton score={200} categoryName={categoryName} />
      <ScoreButton score={300} categoryName={categoryName} />
      <ScoreButton score={400} categoryName={categoryName} />
      <ScoreButton score={500} categoryName={categoryName} />
    </div>
  );
}
