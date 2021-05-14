import React, { createContext, useState } from "react";

export const TeamContext = createContext();

export function LeaderBoardContextProvider(props) {
  const { children } = props;
  const [leaderBoard, setLeaderBoard] = useState([
    {
      name: "ThomasForTheWin",
      score: 100,
    },
  ]);

  const context = {
    leaderBoard,
    setLeaderBoard,
  };

  return (
    <TeamContext.Provider value={context}>
      {children}
    </TeamContext.Provider>
  );
}
