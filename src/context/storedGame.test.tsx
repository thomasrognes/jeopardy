import { expect, test } from "vitest";
import { renderWithProviders, leaderBoard, tile } from "../testUtils";

// Data i localStorage kan være ødelagt eller komme fra en eldre versjon.
test.each([
  ["jeopardy.teams", "ikke json"],
  ["jeopardy.teams", "{}"],
  ["jeopardy.teams", "[null]"],
  ["jeopardy.teams", '[{"name":"Lag 1"}]'],
  ["jeopardy.teams", '[{"name":1,"score":100}]'],
  ["jeopardy.teams", '[{"name":"Lag 1","score":"100"}]'],
  ["jeopardy.categoryNames", "null"],
  ["jeopardy.categoryNames", '["Film"]'],
  ["jeopardy.categoryNames", '{"Sted":1}'],
  ["jeopardy.usedTiles", '{"Sted-100":true}'],
  ["jeopardy.usedTiles", "[100]"],
])("starter blankt når %s er %s", (key, stored) => {
  window.localStorage.setItem(key, stored);

  renderWithProviders();

  expect(leaderBoard()).toEqual([]);
  expect(tile("Sted", 100)).toBeEnabled();
});

test("beholder gyldige data selv om andre deler er ødelagt", () => {
  window.localStorage.setItem("jeopardy.teams", "ikke json");
  window.localStorage.setItem("jeopardy.usedTiles", '["Sted-100"]');

  renderWithProviders();

  expect(tile("Sted", 100)).toBeDisabled();
});
