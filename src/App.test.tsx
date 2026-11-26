import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import {
  addTeam,
  awardPoints,
  category,
  leaderBoard,
  renameCategory,
  renderWithProviders,
  tile,
} from "./testUtils";

test("viser et brett med fire kategorier à fem ruter", () => {
  renderWithProviders();

  expect(
    screen.getByRole("heading", { level: 1, name: "Jeopardy" })
  ).toBeInTheDocument();

  for (const name of ["Sted", "Tall", "Mat og drikke", "Tid"]) {
    for (const score of [100, 200, 300, 400, 500]) {
      expect(tile(name, score)).toBeEnabled();
    }
  }
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
});

test("en hel spillrunde med to lag", async () => {
  renderWithProviders();
  await addTeam("Rødt lag");
  await addTeam("Blått lag");

  await awardPoints("Sted", 100, "Rødt lag");
  await awardPoints("Tall", 500, "Blått lag");
  await awardPoints("Tid", 300, "Rødt lag");

  expect(leaderBoard()).toEqual([
    ["1", "Blått lag", "500"],
    ["2", "Rødt lag", "400"],
  ]);
  expect(tile("Sted", 100)).toBeDisabled();
  expect(tile("Tall", 500)).toBeDisabled();
  expect(tile("Tid", 300)).toBeDisabled();
  expect(tile("Tall", 100)).toBeEnabled();
});

test("beholder spillet etter omlasting", async () => {
  const { unmount } = renderWithProviders();
  await addTeam("Lag 1");
  await renameCategory("Sted", "Steder");
  await awardPoints("Tall", 200, "Lag 1");

  unmount();
  renderWithProviders();

  expect(category("Steder")).toBeInTheDocument();
  expect(leaderBoard()).toEqual([["1", "Lag 1", "200"]]);
  expect(tile("Tall", 200)).toBeDisabled();
  expect(tile("Steder", 200)).toBeEnabled();
});
