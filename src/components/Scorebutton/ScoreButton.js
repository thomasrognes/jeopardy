import React, { useState } from "react";

import "./ScoreButton.css";


export function ScoreButton(props) {
  const [isDisabled, setIsDisabled] = useState(false);

  const classNames = require("classnames");
  const classNamesForScoreButton = classNames({
    "score-button": true,
    "score-button-disabled": isDisabled,
    "score-button-not-disabled": !isDisabled,
  });

  const { score } = props;

  return (
    <button
      className={classNamesForScoreButton}
      onClick={() => setIsDisabled(true)}
      disabled={isDisabled}
    >
      {score}
    </button>
  );
}
