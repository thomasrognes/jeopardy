import React, { useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog/ConfirmDialog";
import { teamColor } from "../../game/teams";
import { useBoard } from "../../hooks/boardHooks";
import { useTeamActions } from "../../hooks/teamActionHooks";
import { useAllTeam } from "../../hooks/teamHooks";
import { NewTeamForm } from "./NewTeamForm";
import { TeamField } from "./TeamField";

export function TeamList() {
  const { teams } = useAllTeam();
  const { rounds } = useBoard();
  const { renameTeam, removeTeam } = useTeamActions();
  const [teamToRemove, setTeamToRemove] = useState<string | null>(null);
  const names = teams.map((team) => team.name);

  return (
    <>
      {teams.length > 0 && (
        <ul className="team-list">
          {teams.map((team, index) => (
            <TeamField
              name={team.name}
              number={index + 1}
              color={teamColor(team, index)}
              otherNames={names.filter((name) => name !== team.name)}
              onRename={(name) => renameTeam(team.name, name)}
              onRemove={() => requestRemoval(team.name, team.score)}
              key={index}
            />
          ))}
        </ul>
      )}

      <NewTeamForm takenNames={names} />

      {teamToRemove !== null && (
        <ConfirmDialog
          title="Fjern lag"
          message={`Vil du fjerne «${teamToRemove}»? Laget og poengene slettes.`}
          confirmLabel="Ja, fjern"
          onCancel={() => setTeamToRemove(null)}
          onConfirm={() => {
            removeTeam(teamToRemove);
            setTeamToRemove(null);
          }}
        />
      )}
    </>
  );

  // Et lag som har vært med i spillet, fjernes først etter bekreftelse.
  function requestRemoval(name: string, score: number) {
    if (score !== 0 || rounds.some((round) => round.teamName === name)) {
      setTeamToRemove(name);
    } else {
      removeTeam(name);
    }
  }
}
