import { expect, test } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addTeam,
  awardNoPoints,
  awardPoints,
  closeModal,
  dialogButton,
  leaderBoard,
  renderWithProviders,
  tile,
} from "../../testUtils";

function dialogTitle(name = "Sted 100 poeng") {
  return screen.queryByRole("heading", { name });
}

function dialogButtonNames() {
  return within(screen.getByRole("dialog"))
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-label") ?? button.textContent);
}

async function renderWithTeams(...names: string[]) {
  renderWithProviders();
  for (const name of names) {
    await addTeam(name);
  }
}

test("viser kategori, poengsum og én knapp per lag", async () => {
  await renderWithTeams("Lag 1", "Lag 2");

  await userEvent.click(tile("Tall", 400));

  expect(dialogTitle("Tall 400 poeng")).toBeInTheDocument();
  expect(screen.getByText("Hvem gjettet riktig?")).toBeInTheDocument();
  expect(dialogButtonNames()).toEqual([
    "Lag 1",
    "Lag 2",
    "Ingen gjettet riktig",
    "Lukk",
  ]);
});

test("gir poengene til laget med ett klikk og bruker opp ruten", async () => {
  await renderWithTeams("Lag 1", "Lag 2");

  await awardPoints("Sted", 100, "Lag 2");

  expect(leaderBoard()).toEqual([
    ["1", "Lag 2", "100"],
    ["2", "Lag 1", "0"],
  ]);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(tile("Sted", 100)).toBeDisabled();
});

test("legger sammen poeng, også etter at plasseringene er byttet om", async () => {
  await renderWithTeams("Lag 1", "Lag 2");

  await awardPoints("Sted", 100, "Lag 2");
  await awardPoints("Sted", 500, "Lag 1");
  await awardPoints("Sted", 200, "Lag 2");

  expect(leaderBoard()).toEqual([
    ["1", "Lag 1", "500"],
    ["2", "Lag 2", "300"],
  ]);
});

test("har lagknappene i fast rekkefølge når plasseringene endres", async () => {
  await renderWithTeams("Lag 1", "Lag 2");
  await awardPoints("Sted", 500, "Lag 2");

  await userEvent.click(tile("Sted", 100));

  expect(dialogButtonNames().slice(0, 2)).toEqual(["Lag 1", "Lag 2"]);
});

test("bruker opp ruten uten poeng når ingen gjettet riktig", async () => {
  await renderWithTeams("Lag 1");

  await awardNoPoints("Sted", 100);

  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
  expect(dialogTitle()).not.toBeInTheDocument();
  expect(tile("Sted", 100)).toBeDisabled();
});

test("kan avslutte en runde før det finnes lag", async () => {
  renderWithProviders();
  await userEvent.click(tile("Sted", 100));
  expect(screen.getByText("Ingen lag er lagt til ennå.")).toBeInTheDocument();

  await userEvent.click(dialogButton("Ingen gjettet riktig"));

  expect(tile("Sted", 100)).toBeDisabled();
});

test("frigir ruten og gir ingen poeng når dialogen lukkes", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));

  await closeModal();

  expect(dialogTitle()).not.toBeInTheDocument();
  expect(tile("Sted", 100)).toBeEnabled();
  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
});

test("regner ikke en åpnet rute som brukt etter omlasting", async () => {
  const { unmount } = renderWithProviders();
  await userEvent.click(tile("Sted", 100));

  unmount();
  renderWithProviders();

  expect(tile("Sted", 100)).toBeEnabled();
});
