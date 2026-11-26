import React, { createContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

export interface Round {
  tileId: string;
  categoryId: string;
  score: number;
  // null når ingen gjettet riktig
  teamName: string | null;
}

export interface BoardContextType {
  categoryNames: Record<string, string>;
  setCategoryName: (categoryId: string, name: string) => void;
  usedTiles: string[];
  // Fullførte runder, med den nyeste sist.
  rounds: Round[];
  addRound: (round: Round) => void;
  removeLastRound: () => void;
  resetBoard: () => void;
}

export const BoardContext = createContext<BoardContextType>(
  undefined as unknown as BoardContextType
);

interface Props {
  children: React.ReactNode;
}

function isCategoryNames(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((name) => typeof name === "string")
  );
}

function isUsedTiles(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === "string");
}

function isRounds(value: unknown): value is Round[] {
  return (
    Array.isArray(value) &&
    value.every(
      (round) =>
        typeof round?.tileId === "string" &&
        typeof round?.categoryId === "string" &&
        typeof round?.score === "number" &&
        (typeof round?.teamName === "string" || round?.teamName === null)
    )
  );
}

export function BoardContextProvider(props: Props) {
  const { children } = props;
  const [categoryNames, setCategoryNames] = usePersistedState(
    "jeopardy.categoryNames",
    {},
    isCategoryNames
  );
  const [usedTiles, setUsedTiles] = usePersistedState(
    "jeopardy.usedTiles",
    [],
    isUsedTiles
  );
  const [rounds, setRounds] = usePersistedState<Round[]>(
    "jeopardy.rounds",
    [],
    isRounds
  );

  const context: BoardContextType = {
    categoryNames,
    setCategoryName: (categoryId, name) =>
      setCategoryNames((names) => ({ ...names, [categoryId]: name })),
    usedTiles,
    rounds,
    addRound: (round) => {
      setUsedTiles((tiles) => [...tiles, round.tileId]);
      setRounds((previous) => [...previous, round]);
    },
    removeLastRound: () => {
      const last = rounds[rounds.length - 1];
      if (!last) {
        return;
      }
      setUsedTiles((tiles) => tiles.filter((id) => id !== last.tileId));
      setRounds((previous) => previous.slice(0, -1));
    },
    resetBoard: () => {
      setCategoryNames({});
      setUsedTiles([]);
      setRounds([]);
    },
  };

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
}
