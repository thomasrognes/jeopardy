import React from "react";
import { ScoreButton } from "../Scorebutton/ScoreButton";

export function Board() {
  return (
    <div className="board">
      <ScoreButton score={"100"} />
      <ScoreButton score={"200"} />
      <ScoreButton score={"300"} />
      <ScoreButton score={"400"} />
      <ScoreButton score={"500"} />
    </div>
  );
}
