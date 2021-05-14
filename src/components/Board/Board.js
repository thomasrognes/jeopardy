import React from "react";
import {Category} from "../Category/Category";
import './Board.css';

export function Board() {
  return (
    <div className="board">
      <Category name={"Sted"} />
      <Category name={"Kroppsdel"} />
      <Category name={"Tid"} />
      <Category name={"Mat"} />
    </div>
  );
}
