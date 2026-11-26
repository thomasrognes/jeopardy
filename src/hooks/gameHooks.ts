import { CATEGORY_IDS, SCORES, toTileId } from "../game/categories";
import { useBoard } from "./boardHooks";
import { useAllTeam } from "./teamHooks";

export function useGame() {
  const { teams, setTeams } = useAllTeam();
  const { usedTiles, resetProgress } = useBoard();

  const remainingTiles = CATEGORY_IDS.flatMap((categoryId) =>
    SCORES.map((score) => toTileId(categoryId, score))
  ).filter((tileId) => !usedTiles.includes(tileId)).length;

  return {
    remainingTiles,
    isInProgress:
      usedTiles.length > 0 || teams.some((team) => team.score !== 0),
    // Lagene og kategoriene beholdes til neste runde.
    startNewGame() {
      setTeams(teams.map((team) => ({ ...team, score: 0 })));
      resetProgress();
    },
  };
}
