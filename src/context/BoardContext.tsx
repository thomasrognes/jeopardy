import React, { createContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

export interface BoardContextType {
  categoryNames: Record<string, string>;
  setCategoryName: (categoryId: string, name: string) => void;
  usedTiles: string[];
  markTileAsUsed: (tileId: string) => void;
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

  const context: BoardContextType = {
    categoryNames,
    setCategoryName: (categoryId, name) =>
      setCategoryNames((names) => ({ ...names, [categoryId]: name })),
    usedTiles,
    markTileAsUsed: (tileId) => setUsedTiles((tiles) => [...tiles, tileId]),
    resetBoard: () => {
      setCategoryNames({});
      setUsedTiles([]);
    },
  };

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
}
