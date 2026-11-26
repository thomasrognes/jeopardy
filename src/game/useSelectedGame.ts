import gameInfo from "../json/gameInfo.json";
import { usePersistedState } from "../hooks/usePersistedState";

function isGameId(value: unknown): value is number | null {
  return typeof value === "number" || value === null;
}

export function useSelectedGame() {
  const [gameId, setGameId] = usePersistedState<number | null>(
    "jeopardy.gameId",
    null,
    isGameId
  );
  const selectedGame = gameInfo.find((game) => game.id === gameId);

  return [selectedGame, setGameId] as const;
}
