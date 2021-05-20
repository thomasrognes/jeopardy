import React, { createContext, useState } from "react";

export interface TeamContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
}

export const TeamContext = createContext<TeamContextType>(
  undefined as unknown as TeamContextType
);

interface Team {
  name: string;
  score: number;
}

interface Props {
  children: React.ReactNode;
}

export function TeamsContextProvider(props: Props) {
  const { children } = props;
  const [teams, setTeams] = useState<Team[]>([]);

  const context: TeamContextType = {
    teams,
    setTeams,
  };

  return (
    <TeamContext.Provider value={context}>{children}</TeamContext.Provider>
  );
}
