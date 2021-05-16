import React from "react";
import { Category } from "../Category/Category";
import "./Board.css";
import { LeaderBoard } from "../LeaderBoard/LeaderBoard";

export function Board() {
  return (
    <div className="board">
      <div className="board-categories">
        <Category name={"Sted"} />
        <Category name={"Tall"} />
        <Category name={"Mat og drikke"} />
        <Category name={"Tid"} />
      </div>
      <div className="board-leaderboard">
        <LeaderBoard />
      </div>
    </div>
  );
}
