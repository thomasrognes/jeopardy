import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import {
  renderScreen,
  renderWithProviders,
  scoreboard,
  store,
  tile,
} from "../testUtils";

// Data i localStorage kan være ødelagt eller komme fra en eldre versjon.
test.each([
  ["jeopardy.teams", "ikke json"],
  ["jeopardy.teams", "{}"],
  ["jeopardy.teams", "[null]"],
  ["jeopardy.teams", '[{"name":"Lag 1"}]'],
  ["jeopardy.teams", '[{"name":1,"score":100}]'],
  ["jeopardy.teams", '[{"name":"Lag 1","score":"100"}]'],
  ["jeopardy.teams", '[{"name":"Lag 1","score":0,"color":-1}]'],
  ["jeopardy.teams", '[{"name":"Lag 1","score":0,"color":"rød"}]'],
  ["jeopardy.categoryNames", "null"],
  ["jeopardy.categoryNames", '["Film"]'],
  ["jeopardy.categoryNames", '{"Sted":1}'],
  ["jeopardy.usedTiles", '{"Sted-100":true}'],
  ["jeopardy.usedTiles", "[100]"],
  ["jeopardy.rounds", "{}"],
  ["jeopardy.rounds", "[null]"],
  ["jeopardy.rounds", '[{"tileId":"Sted-100"}]'],
])("starter blankt når %s er %s", (key, stored) => {
  window.localStorage.setItem(key, stored);

  renderScreen("board");

  expect(scoreboard()).toEqual([]);
  expect(tile("Sted", 100)).toBeEnabled();
  expect(screen.queryByRole("button", { name: /^Angre/ })).toBeNull();
});

test.each(["ikke json", '"meny"', "1"])(
  "viser oppsettet når lagret skjerm er %s",
  (stored) => {
    window.localStorage.setItem("jeopardy.screen", stored);

    renderWithProviders();

    expect(
      screen.getByRole("button", { name: "Start spillet" })
    ).toBeInTheDocument();
  }
);

test("tåler et spill som er lagret uten farger og skjerm", () => {
  store("teams", [{ name: "Lag 1", score: 200 }]);
  store("usedTiles", ["Sted-200"]);

  renderWithProviders();

  expect(
    screen.getByRole("button", { name: "Fortsett spillet" })
  ).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Navn på lag 1" })).toHaveValue(
    "Lag 1"
  );
});

test("beholder gyldige data selv om andre deler er ødelagt", () => {
  window.localStorage.setItem("jeopardy.teams", "ikke json");
  store("usedTiles", ["Sted-100"]);

  renderScreen("board");

  expect(tile("Sted", 100)).toBeDisabled();
});
