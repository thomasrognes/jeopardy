import { useBoard } from "./boardHooks";
import { useAllTeam } from "./teamHooks";

// Rundene viser til lagene med navn, så historikken må følge med når et lag
// endres. Ellers ville «Angre» truffet feil lag.
export function useTeamActions() {
  const { teams, setTeams } = useAllTeam();
  const { replaceTeamInRounds } = useBoard();

  return {
    renameTeam(from: string, to: string) {
      setTeams(
        teams.map((team) => (team.name === from ? { ...team, name: to } : team))
      );
      replaceTeamInRounds(from, to);
    },
    removeTeam(name: string) {
      setTeams(teams.filter((team) => team.name !== name));
      // Runden kan fortsatt angres, men har ingen poeng å trekke tilbake.
      replaceTeamInRounds(name, null);
    },
  };
}
