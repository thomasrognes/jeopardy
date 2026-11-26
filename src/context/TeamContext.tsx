import React, { createContext } from "react";
import { Team } from "../game/teams";
import { usePersistedState } from "../hooks/usePersistedState";

export interface TeamContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
}

export const TeamContext = createContext<TeamContextType>(
  undefined as unknown as TeamContextType
);

interface Props {
  children: React.ReactNode;
}

function isTeams(value: unknown): value is Team[] {
  return (
    Array.isArray(value) &&
    value.every(
      (team) =>
        typeof team?.name === "string" &&
        typeof team?.score === "number" &&
        (team.color === undefined ||
          (Number.isInteger(team.color) && team.color >= 0))
    )
  );
}

export function TeamsContextProvider(props: Props) {
  const { children } = props;
  const [teams, setTeams] = usePersistedState<Team[]>(
    "jeopardy.teams",
    [],
    isTeams
  );

  const context: TeamContextType = {
    teams,
    setTeams,
  };

  return (
    <TeamContext.Provider value={context}>{children}</TeamContext.Provider>
  );
}
