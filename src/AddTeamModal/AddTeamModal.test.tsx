import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addTeam,
  closeModal,
  leaderBoard,
  renderWithProviders,
} from "../testUtils";

const emptyNameError = "Lagnavn kan ikke være tomt.";
const duplicateNameError = "Det finnes allerede et lag med det navnet.";

function dialogTitle() {
  return screen.queryByRole("heading", { name: "Legg til nytt lag" });
}

test("legger til et lag med 0 poeng og lukker dialogen", async () => {
  renderWithProviders();

  await addTeam("Lag 1");

  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
  expect(dialogTitle()).not.toBeInTheDocument();
});

test("legger til laget når man trykker Enter", async () => {
  renderWithProviders();
  await userEvent.click(screen.getByText("Legg til nytt lag"));

  await userEvent.type(screen.getByLabelText(/Lagnavn/), "Lag 1{Enter}");

  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
  expect(dialogTitle()).not.toBeInTheDocument();
});

test("knytter feilmeldingen til tekstfeltet", async () => {
  renderWithProviders();
  await userEvent.click(screen.getByText("Legg til nytt lag"));

  await userEvent.click(screen.getByText("Fullfør"));

  expect(screen.getByLabelText(/Lagnavn/)).toHaveAccessibleDescription(
    emptyNameError
  );
});

test("fjerner mellomrom foran og bak lagnavnet", async () => {
  renderWithProviders();

  await addTeam("  Lag 1  ");

  expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
});

test.each([
  ["tomt", ""],
  ["bare mellomrom", "   "],
])("avviser lagnavn som er %s", async (_, name) => {
  renderWithProviders();
  await userEvent.click(screen.getByText("Legg til nytt lag"));
  if (name) {
    await userEvent.type(screen.getByLabelText(/Lagnavn/), name);
  }

  await userEvent.click(screen.getByText("Fullfør"));

  expect(screen.getByText(emptyNameError)).toBeInTheDocument();
  expect(screen.getByLabelText(/Lagnavn/)).toBeInvalid();
  expect(dialogTitle()).toBeInTheDocument();
  expect(leaderBoard()).toEqual([]);
});

test.each(["Lag 1", "lag 1", "LAG 1", " Lag 1 "])(
  "avviser «%s» når «Lag 1» finnes fra før",
  async (name) => {
    renderWithProviders();
    await addTeam("Lag 1");

    await addTeam(name);

    expect(screen.getByText(duplicateNameError)).toBeInTheDocument();
    expect(leaderBoard()).toEqual([["1", "Lag 1", "0"]]);
  }
);

test("fjerner feilmeldingen når navnet endres", async () => {
  renderWithProviders();
  await addTeam("Lag 1");
  await addTeam("Lag 1");

  await userEvent.type(screen.getByLabelText(/Lagnavn/), "0");
  expect(screen.queryByText(duplicateNameError)).not.toBeInTheDocument();
  await userEvent.click(screen.getByText("Fullfør"));

  expect(leaderBoard()).toEqual([
    ["1", "Lag 1", "0"],
    ["2", "Lag 10", "0"],
  ]);
});

test("legger ikke til noe når dialogen lukkes", async () => {
  renderWithProviders();
  await userEvent.click(screen.getByText("Legg til nytt lag"));
  await userEvent.type(screen.getByLabelText(/Lagnavn/), "Lag 1");

  await closeModal();

  expect(dialogTitle()).not.toBeInTheDocument();
  expect(leaderBoard()).toEqual([]);

  await userEvent.click(screen.getByText("Legg til nytt lag"));
  expect(screen.getByLabelText(/Lagnavn/)).toHaveValue("");
});
