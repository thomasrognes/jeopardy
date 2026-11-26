import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addTeam,
  awardPoints,
  closeModal,
  leaderBoard,
  renderWithProviders,
  teamSelect,
  tile,
} from "../../testUtils";

const requiredError = "Påkrevd felt.";

function noAnswersCheckbox() {
  return screen.getByRole("checkbox", { name: "Ingen gjettet riktig." });
}

function submit() {
  return userEvent.click(screen.getByText("Legg til poeng"));
}

function dialogTitle(name = "Sted 100 poeng") {
  return screen.queryByRole("heading", { name });
}

async function renderWithTeams(...names: string[]) {
  renderWithProviders();
  for (const name of names) {
    await addTeam(name);
  }
}

test("åpner en dialog med kategori, poengsum og alle lag", async () => {
  await renderWithTeams("Lag 1", "Lag 2");

  await userEvent.click(tile("Tall", 400));

  expect(dialogTitle("Tall 400 poeng")).toBeInTheDocument();
  expect(
    screen.getAllByRole("option").map((option) => option.textContent)
  ).toEqual(["", "Lag 1", "Lag 2"]);
});

test("gir poengene til valgt lag og bruker opp ruten", async () => {
  await renderWithTeams("Lag 1", "Lag 2");

  await awardPoints("Sted", 100, "Lag 2");

  expect(leaderBoard()).toEqual([
    ["1", "Lag 2", "100"],
    ["2", "Lag 1", "0"],
  ]);
  expect(dialogTitle()).not.toBeInTheDocument();
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

test("bruker opp ruten uten poeng når ingen gjettet riktig", async () => {
  await renderWithTeams("Lag 1");

  await userEvent.click(tile("Sted", 100));
  await userEvent.click(noAnswersCheckbox());
  await submit();

  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
  expect(dialogTitle()).not.toBeInTheDocument();
  expect(tile("Sted", 100)).toBeDisabled();
});

test("gir ingen poeng hvis både lag og «Ingen gjettet riktig» er valgt", async () => {
  await renderWithTeams("Lag 1");

  await userEvent.click(tile("Sted", 100));
  await userEvent.selectOptions(teamSelect(), "Lag 1");
  await userEvent.click(noAnswersCheckbox());
  await submit();

  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
});

test("gir poeng hvis «Ingen gjettet riktig» hukes av igjen", async () => {
  await renderWithTeams("Lag 1");

  await userEvent.click(tile("Sted", 100));
  await userEvent.selectOptions(teamSelect(), "Lag 1");
  await userEvent.click(noAnswersCheckbox());
  await userEvent.click(noAnswersCheckbox());
  await submit();

  expect(leaderBoard()).toEqual([["1", "Lag 1", "100"]]);
});

test("krever at et lag velges", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));

  await submit();

  expect(screen.getByText(requiredError)).toBeInTheDocument();
  expect(dialogTitle()).toBeInTheDocument();
});

test("krever et lag også når valget settes tilbake til tomt", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));

  await userEvent.selectOptions(teamSelect(), "Lag 1");
  await userEvent.selectOptions(teamSelect(), "");
  await submit();

  expect(screen.getByText(requiredError)).toBeInTheDocument();
  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
});

test("fjerner feilmeldingen når et lag velges", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));
  await submit();

  await userEvent.selectOptions(teamSelect(), "Lag 1");

  expect(screen.queryByText(requiredError)).not.toBeInTheDocument();
});

test("frigir ruten når dialogen lukkes", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));

  await closeModal();

  expect(dialogTitle()).not.toBeInTheDocument();
  expect(tile("Sted", 100)).toBeEnabled();
});

test("husker ikke valgt lag etter at dialogen er lukket", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));
  await userEvent.selectOptions(teamSelect(), "Lag 1");
  await closeModal();

  await userEvent.click(tile("Sted", 100));
  expect(teamSelect()).toHaveValue("");
  await submit();

  expect(screen.getByText(requiredError)).toBeInTheDocument();
  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
});

test("husker ikke «Ingen gjettet riktig» etter at dialogen er lukket", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));
  await userEvent.click(noAnswersCheckbox());
  await closeModal();

  await userEvent.click(tile("Sted", 100));
  expect(noAnswersCheckbox()).not.toBeChecked();
  await submit();

  expect(screen.getByText(requiredError)).toBeInTheDocument();
});

test("husker ikke feilmeldingen etter at dialogen er lukket", async () => {
  await renderWithTeams("Lag 1");
  await userEvent.click(tile("Sted", 100));
  await submit();
  await closeModal();

  await userEvent.click(tile("Sted", 100));

  expect(screen.queryByText(requiredError)).not.toBeInTheDocument();
});

test("regner ikke en åpnet rute som brukt etter omlasting", async () => {
  const { unmount } = renderWithProviders();
  await userEvent.click(tile("Sted", 100));

  unmount();
  renderWithProviders();

  expect(tile("Sted", 100)).toBeEnabled();
});
