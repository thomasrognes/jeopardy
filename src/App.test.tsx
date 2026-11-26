import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import {
  awardPoints,
  chooseFromMenu,
  click,
  renderWithProviders,
  scoreboard,
  startGame,
  teamNames,
  tile,
} from "./testUtils";

function heading(name: string) {
  return screen.queryByRole("heading", { level: 1, name });
}

test("starter på oppsettet", () => {
  renderWithProviders();

  expect(
    screen.getByRole("button", { name: "Start spillet" })
  ).toBeInTheDocument();
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});

test("en hel spillkveld fra oppsett til nytt spill", async () => {
  await startGame("Rødt lag", "Blått lag");

  await awardPoints("Sted", 100, "Rødt lag");
  await awardPoints("Tall", 500, "Blått lag");
  await awardPoints("Tid", 300, "Rødt lag");

  expect(scoreboard()).toEqual(["Rødt lag100 bak400", "Blått lagLeder500"]);
  expect(tile("Sted", 100)).toBeDisabled();
  expect(tile("Tall", 100)).toBeEnabled();

  await chooseFromMenu("Avslutt og kår vinner");
  expect(heading("Blått lag")).toBeInTheDocument();

  await click("Nytt spill");
  await click("Start på nytt");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  expect(teamNames()).toEqual(["Rødt lag", "Blått lag"]);
  await click("Start spillet");
  expect(scoreboard()).toEqual(["Rødt lag0", "Blått lag0"]);
  expect(tile("Sted", 100)).toBeEnabled();
});

test("husker spillet og hvilken skjerm man var på", async () => {
  const { unmount } = await startGame("Lag 1");
  await awardPoints("Tall", 200, "Lag 1");

  unmount();
  renderWithProviders();

  expect(scoreboard()).toEqual(["Lag 1Leder200"]);
  expect(tile("Tall", 200)).toBeDisabled();
});

test("kan gå til oppsettet og tilbake uten å miste noe", async () => {
  await startGame("Lag 1");
  await awardPoints("Tall", 200, "Lag 1");

  await chooseFromMenu("Endre oppsett");
  await click("Fortsett spillet");

  expect(scoreboard()).toEqual(["Lag 1Leder200"]);
  await click(/^Angre/);
  expect(scoreboard()).toEqual(["Lag 10"]);
});
