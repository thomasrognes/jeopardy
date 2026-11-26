import { expect, test } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addTeam,
  awardPoints,
  category,
  closeModal,
  leaderBoard,
  renameCategory,
  renderWithProviders,
  tile,
} from "../../testUtils";

async function playOneRound() {
  await addTeam("Lag 1");
  await renameCategory("Sted", "Steder");
  await awardPoints("Tall", 200, "Lag 1");
}

function confirmButton() {
  return screen.queryByRole("button", { name: "Ja, nullstill" });
}

test("åpner og lukker dialogen for valg av spill", async () => {
  renderWithProviders();

  await userEvent.click(screen.getByRole("button", { name: "Velg spill" }));
  expect(
    screen.getByRole("heading", { name: "Endre spill" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("combobox", { name: "Velg spill" })
  ).toBeInTheDocument();

  await closeModal();
  expect(
    screen.queryByRole("heading", { name: "Endre spill" })
  ).not.toBeInTheDocument();
});

test("sletter ingenting før nullstillingen er bekreftet", async () => {
  renderWithProviders();
  await playOneRound();

  await userEvent.click(
    screen.getByRole("button", { name: "Nullstill spill" })
  );
  expect(confirmButton()).toBeInTheDocument();
  await closeModal();

  expect(confirmButton()).not.toBeInTheDocument();
  expect(category("Steder")).toBeInTheDocument();
  expect(leaderBoard()).toEqual([["1", "Lag 1", "200"]]);
  expect(tile("Tall", 200)).toBeDisabled();
});

test("avbryter nullstillingen uten å slette noe", async () => {
  renderWithProviders();
  await playOneRound();
  await userEvent.click(
    screen.getByRole("button", { name: "Nullstill spill" })
  );

  await userEvent.click(screen.getByRole("button", { name: "Avbryt" }));

  expect(confirmButton()).not.toBeInTheDocument();
  expect(leaderBoard()).toEqual([["1", "Lag 1", "200"]]);
});

// Nettleseren gir fokus til den første knappen i en dialog, så rekkefølgen
// avgjør hva Enter gjør.
test("har Avbryt som første knapp i nullstillingsdialogen", async () => {
  renderWithProviders();

  await userEvent.click(
    screen.getByRole("button", { name: "Nullstill spill" })
  );

  const [first] = within(screen.getByRole("dialog")).getAllByRole("button");
  expect(first).toHaveAccessibleName("Avbryt");
});

test("nullstiller lag, kategorinavn og ruter, også etter omlasting", async () => {
  const { unmount } = renderWithProviders();
  await playOneRound();

  await userEvent.click(
    screen.getByRole("button", { name: "Nullstill spill" })
  );
  await userEvent.click(confirmButton()!);

  function expectNewGame() {
    expect(category("Sted")).toBeInTheDocument();
    expect(leaderBoard()).toEqual([]);
    expect(tile("Tall", 200)).toBeEnabled();
  }
  expect(confirmButton()).not.toBeInTheDocument();
  expectNewGame();

  unmount();
  renderWithProviders();
  expectNewGame();
});
