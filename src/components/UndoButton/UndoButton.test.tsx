import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addTeam,
  awardNoPoints,
  awardPoints,
  leaderBoard,
  renameCategory,
  renderWithProviders,
  tile,
} from "../../testUtils";

function undoButton() {
  return screen.queryByRole("button", { name: /^Angre/ });
}

function undo() {
  return userEvent.click(undoButton()!);
}

async function renderWithTeams() {
  const view = renderWithProviders();
  await addTeam("Lag 1");
  await addTeam("Lag 2");
  return view;
}

test("vises ikke før en runde er fullført", async () => {
  await renderWithTeams();

  expect(undoButton()).not.toBeInTheDocument();
});

test("beskriver runden som vil bli angret", async () => {
  await renderWithTeams();

  await awardPoints("Sted", 300, "Lag 2");
  expect(undoButton()).toHaveAccessibleName("Angre: Sted 300 – Lag 2");

  await awardNoPoints("Tall", 100);
  expect(undoButton()).toHaveAccessibleName("Angre: Tall 100 – ingen poeng");
});

test("bruker kategoriens nåværende navn", async () => {
  await renderWithTeams();
  await awardPoints("Sted", 300, "Lag 1");

  await renameCategory("Sted", "Film");

  expect(undoButton()).toHaveAccessibleName("Angre: Film 300 – Lag 1");
});

test("trekker tilbake poengene og åpner ruten igjen", async () => {
  await renderWithTeams();
  await awardPoints("Sted", 300, "Lag 2");

  await undo();

  expect(leaderBoard()).toEqual([
    ["1", "Lag 1", "0"],
    ["1", "Lag 2", "0"],
  ]);
  expect(tile("Sted", 300)).toBeEnabled();
  expect(undoButton()).not.toBeInTheDocument();
});

test("angrer flere runder i motsatt rekkefølge", async () => {
  await renderWithTeams();
  await awardPoints("Sted", 100, "Lag 1");
  await awardPoints("Sted", 200, "Lag 1");
  await awardNoPoints("Sted", 300);

  await undo();
  expect(tile("Sted", 300)).toBeEnabled();
  expect(tile("Sted", 200)).toBeDisabled();
  expect(leaderBoard()[0]).toEqual(["1", "Lag 1", "300"]);

  await undo();
  expect(tile("Sted", 200)).toBeEnabled();
  expect(tile("Sted", 100)).toBeDisabled();
  expect(leaderBoard()[0]).toEqual(["1", "Lag 1", "100"]);

  await undo();
  expect(tile("Sted", 100)).toBeEnabled();
  expect(leaderBoard()[0]).toEqual(["1", "Lag 1", "0"]);
  expect(undoButton()).not.toBeInTheDocument();
});

test("virker også etter omlasting", async () => {
  const { unmount } = await renderWithTeams();
  await awardPoints("Sted", 100, "Lag 1");

  unmount();
  renderWithProviders();
  await undo();

  expect(leaderBoard()[0]).toEqual(["1", "Lag 1", "0"]);
  expect(tile("Sted", 100)).toBeEnabled();
});

test("har ingenting å angre etter nullstilling", async () => {
  await renderWithTeams();
  await awardPoints("Sted", 100, "Lag 1");

  await userEvent.click(
    screen.getByRole("button", { name: "Nullstill spill" })
  );
  await userEvent.click(screen.getByRole("button", { name: "Ja, nullstill" }));

  expect(undoButton()).not.toBeInTheDocument();
});
