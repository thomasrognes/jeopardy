import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import { leaderBoard, renderWithProviders } from "../../testUtils";
import { LeaderBoard } from "./LeaderBoard";

function storeTeams(teams: { name: string; score: number }[]) {
  window.localStorage.setItem("jeopardy.teams", JSON.stringify(teams));
}

test("viser ingen tabell før det finnes lag", () => {
  renderWithProviders(<LeaderBoard />);

  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(screen.getByText("Legg til nytt lag")).toBeInTheDocument();
});

test("sorterer lagene etter poeng og nummererer plasseringene", () => {
  storeTeams([
    { name: "Sist", score: 100 },
    { name: "Først", score: 900 },
    { name: "Midten", score: 500 },
  ]);

  renderWithProviders(<LeaderBoard />);

  expect(
    screen.getAllByRole("columnheader").map((th) => th.textContent)
  ).toEqual(["Plassering", "Lagnavn", "Poeng"]);
  expect(leaderBoard()).toEqual([
    ["1", "Først", "900"],
    ["2", "Midten", "500"],
    ["3", "Sist", "100"],
  ]);
});
