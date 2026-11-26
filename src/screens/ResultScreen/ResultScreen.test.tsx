import { expect, test } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  click,
  dialogButton,
  renderScreen,
  scoreboard,
  store,
} from "../../testUtils";

function storeScores(...scores: number[]) {
  store(
    "teams",
    scores.map((score, index) => ({ name: `Lag ${index + 1}`, score }))
  );
}

function listItems(name: string) {
  return within(screen.getByRole("list", { name }))
    .getAllByRole("listitem")
    .map((item) => item.textContent);
}

function title() {
  return screen.getByRole("heading", { level: 1 });
}

test("kårer vinneren og viser resten i rekkefølge", () => {
  storeScores(800, 2400, 1500, 1900, 100);

  renderScreen("result");

  expect(screen.getByText("Vinneren er")).toBeInTheDocument();
  expect(title()).toHaveTextContent("Lag 2");
  expect(listItems("Seierspall")).toEqual([
    "Lag 212400",
    "Lag 421900",
    "Lag 331500",
  ]);
  expect(listItems("Øvrige lag")).toEqual([
    "4. Lag 1 · 800 poeng",
    "5. Lag 5 · 100 poeng",
  ]);
});

test.each([
  [[500, 500, 100], "Lag 1 og Lag 2"],
  [[500, 500, 500], "Lag 1, Lag 2 og Lag 3"],
])("deler seieren ved likt (%s)", (scores, winners) => {
  storeScores(...scores);

  renderScreen("result");

  expect(screen.getByText("Vinnerne er")).toBeInTheDocument();
  expect(title()).toHaveTextContent(winners);
});

test("gir lag med like mange poeng samme plassering", () => {
  storeScores(900, 500, 500, 100);

  renderScreen("result");

  expect(listItems("Seierspall")).toEqual([
    "Lag 11900",
    "Lag 22500",
    "Lag 32500",
  ]);
  expect(listItems("Øvrige lag")).toEqual(["4. Lag 4 · 100 poeng"]);
});

test("kårer ingen vinner når ingen har poeng", () => {
  storeScores(0, 0);

  renderScreen("result");

  expect(title()).toHaveTextContent("Ingen vinner ennå");
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("går tilbake til brettet med poengene i behold", async () => {
  storeScores(300);
  renderScreen("result");

  await click("Tilbake til brettet");

  expect(scoreboard()).toEqual(["Lag 1Leder300"]);
});

test("ber om bekreftelse før et nytt spill", async () => {
  storeScores(300);
  renderScreen("result");

  await click("Nytt spill");
  await userEvent.click(dialogButton("Avbryt"));
  expect(title()).toHaveTextContent("Lag 1");

  await click("Nytt spill");
  await userEvent.click(dialogButton("Start på nytt"));

  expect(
    screen.getByRole("button", { name: "Start spillet" })
  ).toBeInTheDocument();
});
