import { useContext } from "react";
import { TeamContext } from "../context/TeamContext";

export function useAllTeam() {
  return useContext(TeamContext);
}
