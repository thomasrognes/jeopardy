import React from "react";
import { Category } from "../Category/Category";
import { LeaderBoard } from "../LeaderBoard/LeaderBoard";
import { GameInfo } from "../GameInfo/GameInfo";

import "./Board.scss";

export function Board() {
  return (
    <div className="board">
      <div className="board__categories">
        <Category name={"Sted"} />
        <Category name={"Tall"} />
        <Category name={"Mat og drikke"} />
        <Category name={"Tid"} />
      </div>
      <div>
        <LeaderBoard />
      </div>
      <GameInfo />
    </div>
  );
}
