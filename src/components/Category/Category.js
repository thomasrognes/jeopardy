import React, { useState } from "react";
import { ScoreButton } from "../Scorebutton/ScoreButton";

import "./Category.css";

export function Category(props) {
  const { name } = props;

  const [categoryName, setCategoryName] = useState(name);

  return (
    <div className="category">
      <h1>{categoryName}</h1>
      <ScoreButton score={"100"} />
      <ScoreButton score={"200"} />
      <ScoreButton score={"300"} />
      <ScoreButton score={"400"} />
      <ScoreButton score={"500"} />
    </div>
  );
}
