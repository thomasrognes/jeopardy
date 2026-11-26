import { Round } from "../context/BoardContext";
import { useBoard } from "./boardHooks";
import { useAllTeam } from "./teamHooks";

// En runde endrer både brettet og poengene, så de to oppdateres samlet her.
export function useRounds() {
  const { teams, setTeams } = useAllTeam();
  const { rounds, addRound, removeLastRound } = useBoard();
  const lastRound: Round | undefined = rounds[rounds.length - 1];

  function changeScore(teamName: string | null, change: number) {
    setTeams(
      teams.map((team) =>
        team.name === teamName ? { ...team, score: team.score + change } : team
      )
    );
  }

  return {
    lastRound,
    completeRound(round: Round) {
      changeScore(round.teamName, round.score);
      addRound(round);
    },
    undoLastRound() {
      if (!lastRound) {
        return;
      }
      changeScore(lastRound.teamName, -lastRound.score);
      removeLastRound();
    },
  };
}
