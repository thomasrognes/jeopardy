import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { BoardContextProvider } from "./context/BoardContext";
import { TeamsContextProvider } from "./context/TeamContext";

export function renderWithProviders(ui: React.ReactElement = <App />) {
  return render(
    <TeamsContextProvider>
      <BoardContextProvider>{ui}</BoardContextProvider>
    </TeamsContextProvider>
  );
}

export async function addTeam(name: string) {
  await userEvent.click(screen.getByText("Legg til nytt lag"));
  await userEvent.type(screen.getByLabelText(/Lagnavn/), name);
  await userEvent.click(screen.getByText("Fullfør"));
}

export function category(name: string) {
  return screen.getByRole("group", { name });
}

export function editButton(column: HTMLElement) {
  return within(column).getByRole("button", { name: "Rediger kategorinavn" });
}

export async function renameCategory(from: string, to: string) {
  const column = category(from);
  await userEvent.click(editButton(column));
  const input = within(column).getByRole("textbox", { name: "Kategorinavn" });
  await userEvent.clear(input);
  await userEvent.type(input, to);
  await userEvent.click(editButton(column));
}

export function tile(categoryName: string, score: number) {
  return within(category(categoryName)).getByRole("button", {
    name: String(score),
  });
}

export function teamSelect() {
  return screen.getByRole("combobox", {
    name: "Velg laget som gjettet korrekt:",
  });
}

export async function awardPoints(
  categoryName: string,
  score: number,
  teamName: string
) {
  await userEvent.click(tile(categoryName, score));
  await userEvent.selectOptions(teamSelect(), teamName);
  await userEvent.click(screen.getByText("Legg til poeng"));
}

export async function closeModal() {
  await userEvent.click(screen.getByRole("button", { name: "Lukk" }));
}

// Poengtavlen som [plassering, lagnavn, poeng] per rad.
export function leaderBoard() {
  return screen
    .queryAllByRole("row")
    .slice(1) // overskriftsraden
    .map((row) =>
      within(row)
        .getAllByRole("cell")
        .map((cell) => cell.textContent)
    );
}
