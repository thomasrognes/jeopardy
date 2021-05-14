import React, { createContext, useState } from "react";

export const TeamContext = createContext();

export function TeamsContextProvider(props) {
  const { children } = props;
  const [teams, setTeams] = useState([]);

  const context = {
    teams,
    setTeams,
  };

  return (
    <TeamContext.Provider value={context}>{children}</TeamContext.Provider>
  );
}
