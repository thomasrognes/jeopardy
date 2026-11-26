import { expect, test } from "vitest";
import { nextColor, TEAM_COLORS, teamColor, Team } from "./teams";

function team(color?: number): Team {
  return { name: "Lag", score: 0, color };
}

test("gir hvert nytt lag en ledig farge", () => {
  expect(nextColor([])).toBe(0);
  expect(nextColor([team(0), team(1)])).toBe(2);
  expect(nextColor([team(0), team(2)])).toBe(1);
});

test("gjenbruker farger når alle er tatt", () => {
  const teams = TEAM_COLORS.map((_, index) => team(index));

  expect(nextColor(teams)).toBe(0);
});

test("bruker plassen i listen for lag uten lagret farge", () => {
  expect(teamColor(team(), 2)).toBe(TEAM_COLORS[2]);
  expect(teamColor(team(5), 2)).toBe(TEAM_COLORS[5]);
  expect(nextColor([team(), team()])).toBe(2);
});
