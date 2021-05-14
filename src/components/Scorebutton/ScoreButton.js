import React, { useState } from "react";

export function ScoreButton(props) {
  const [isActivated, setIsActivated] = useState(false);

  const { score } = props;

  return <button onClick={() => console.log("Halla")}>{score}</button>;
}
