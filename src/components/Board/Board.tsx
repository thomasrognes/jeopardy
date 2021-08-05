import React from "react";
import { Category } from "../Category/Category";

import "./Board.scss";

export function Board() {
  return (
    <section className="board">
      <div className="board__categories">
        <Category name={"Sted"} />
        <Category name={"Tall"} />
        <Category name={"Mat og drikke"} />
        <Category name={"Tid"} />
      </div>
    </section>
  );
}
