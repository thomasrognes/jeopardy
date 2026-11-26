import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App, { Screen } from "./App";
import { BoardContextProvider } from "./context/BoardContext";
import { TeamsContextProvider } from "./context/TeamContext";

export function renderWithProviders(ui: React.ReactElement = <App />) {
  return render(
    <TeamsContextProvider>
      <BoardContextProvider>{ui}</BoardContextProvider>
    </TeamsContextProvider>
  );
}

// Lagrer data slik appen selv gjør, før den rendres.
export function store(key: string, value: unknown) {
  window.localStorage.setItem(`jeopardy.${key}`, JSON.stringify(value));
}

export function renderScreen(screenName: Screen) {
  store("screen", screenName);
  return renderWithProviders();
}

export function click(name: string | RegExp) {
  return userEvent.click(screen.getByRole("button", { name }));
}

// --- Oppsett ---

export function newTeamField() {
  return screen.getByRole("textbox", { name: "Navn på nytt lag" });
}

export async function addTeam(name: string) {
  await userEvent.type(newTeamField(), `${name}{Enter}`);
}

export function teamNames() {
  return screen
    .queryAllByRole<HTMLInputElement>("textbox", { name: /^Navn på lag \d+$/ })
    .map((input) => input.value);
}

// Rendrer oppsettet, legger til lagene og starter spillet.
export async function startGame(...names: string[]) {
  const view = renderWithProviders();
  for (const name of names) {
    await addTeam(name);
  }
  await click(/^(Start|Fortsett) spillet$/);
  return view;
}

// --- Brettet ---

export function category(name: string) {
  return screen.getByRole("group", { name });
}

export function tile(categoryName: string, score: number) {
  return within(category(categoryName)).getByRole("button", {
    name: new RegExp(`^${score}(, brukt)?$`),
  });
}

// En knapp i den åpne dialogen.
export function dialogButton(name: string) {
  return within(screen.getByRole("dialog")).getByRole("button", { name });
}

export async function awardPoints(
  categoryName: string,
  score: number,
  teamName: string
) {
  await userEvent.click(tile(categoryName, score));
  await userEvent.click(dialogButton(teamName));
}

export async function awardNoPoints(categoryName: string, score: number) {
  await userEvent.click(tile(categoryName, score));
  await userEvent.click(dialogButton("Ingen svarte riktig"));
}

export async function chooseFromMenu(name: string) {
  await click("Meny");
  await click(name);
}

// Teksten til hvert lag på poengtavlen: navn, status og poeng.
export function scoreboard() {
  const list = screen.queryByRole("list", { name: "Poeng" });
  if (!list) {
    return [];
  }
  return within(list)
    .getAllByRole("listitem")
    .map((item) => item.textContent);
}
