import { useContext } from "react";
import { BoardContext } from "../context/BoardContext";

export function useBoard() {
  return useContext(BoardContext);
}
