import { expect, test } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CATEGORY_IDS, SCORES, toTileId } from "../../game/categories";
import gameInfo from "../../json/gameInfo.json";
import {
  awardNoPoints,
  awardPoints,
  category,
  click,
  dialogButton,
  renderScreen,
  renderWithProviders,
  scoreboard,
  startGame,
  store,
  tile,
} from "../../testUtils";

const allTiles = CATEGORY_IDS.flatMap((id) =>
  SCORES.map((score) => toTileId(id, score))
);

function undoButton() {
  return screen.queryByRole("button", { name: /^Angre/ });
}

function menu() {
  return screen.queryByRole("navigation", { name: "Spillmeny" });
}

// --- Brettet ---

test("viser fire kategorier med fem ruter hver", () => {
  renderScreen("board");

  for (const name of CATEGORY_IDS) {
    for (const score of SCORES) {
      expect(tile(name, score)).toBeEnabled();
    }
  }
  expect(screen.getByText("20 ruter igjen")).toBeInTheDocument();
});

test("har ingen felter eller knapper for redigering", () => {
  renderScreen("board");

  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  // Menyknappen og de 20 rutene er alt man kan trykke på.
  expect(screen.getAllByRole("button")).toHaveLength(21);
});

test("bruker egne kategorinavn, og valgt spill i overskriften", () => {
  store("categoryNames", { Sted: "Film" });
  store("gameId", gameInfo[1].id);
  renderScreen("board");

  expect(category("Film")).toBeInTheDocument();
  expect(
    screen.getByText(`${gameInfo[1].name} · 20 ruter igjen`)
  ).toBeInTheDocument();
});

test("teller ned og viser brukte ruter som tomme", async () => {
  await startGame("Lag 1");

  await awardPoints("Sted", 100, "Lag 1");

  expect(screen.getByText("19 ruter igjen")).toBeInTheDocument();
  expect(tile("Sted", 100)).toHaveAccessibleName("100, brukt");
  expect(tile("Sted", 100)).toBeEmptyDOMElement();
});

// --- Poengskjermen ---

test("viser én knapp per lag, med tilbakeknappen først", async () => {
  await startGame("Lag 1", "Lag 2");

  await userEvent.click(tile("Tall", 400));

  const dialog = screen.getByRole("dialog", { name: "Tall 400" });
  expect(
    within(dialog)
      .getAllByRole("button")
      .map((button) => button.textContent?.replace(/\s/g, " "))
  ).toEqual(["← Tilbake til brettet", "Lag 1", "Lag 2", "Ingen svarte riktig"]);
});

test("går tilbake uten å bruke ruten", async () => {
  await startGame("Lag 1");
  await userEvent.click(tile("Sted", 100));

  await userEvent.click(
    screen.getByRole("button", { name: /Tilbake til brettet/ })
  );

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(tile("Sted", 100)).toBeEnabled();
  expect(scoreboard()).toEqual(["Lag 10"]);
});

// --- Poengtavlen ---

test("holder rekkefølgen og viser leder og avstand", async () => {
  await startGame("Lag 1", "Lag 2", "Lag 3");

  await awardPoints("Sted", 500, "Lag 2");
  await awardPoints("Sted", 200, "Lag 3");

  expect(scoreboard()).toEqual([
    "Lag 1500 bak0",
    "Lag 2Leder500",
    "Lag 3300 bak200",
  ]);
});

test("lar flere lag lede samtidig", async () => {
  await startGame("Lag 1", "Lag 2");

  await awardPoints("Sted", 100, "Lag 1");
  await awardPoints("Tall", 100, "Lag 2");

  expect(scoreboard()).toEqual(["Lag 1Leder100", "Lag 2Leder100"]);
});

// --- Angre ---

test("tilbyr ikke å angre før en runde er fullført", async () => {
  await startGame("Lag 1");

  expect(undoButton()).not.toBeInTheDocument();
});

test("forteller hva som skjedde og hva som angres", async () => {
  await startGame("Lag 1");

  await awardPoints("Sted", 300, "Lag 1");
  expect(screen.getByRole("status")).toHaveTextContent("Lag 1 fikk 300 poeng");
  expect(undoButton()).toHaveAccessibleName("Angre: Sted 300 – Lag 1");

  await awardNoPoints("Tall", 100);
  expect(screen.getByRole("status")).toHaveTextContent(
    "Ingen poeng for Tall 100"
  );
  expect(undoButton()).toHaveAccessibleName("Angre: Tall 100 – ingen poeng");
});

test("angrer flere runder i motsatt rekkefølge, også etter omlasting", async () => {
  const { unmount } = await startGame("Lag 1");
  await awardPoints("Sted", 100, "Lag 1");
  await awardPoints("Sted", 200, "Lag 1");
  await awardNoPoints("Sted", 300);
  unmount();
  renderWithProviders();

  await userEvent.click(undoButton()!);
  expect(tile("Sted", 300)).toBeEnabled();
  expect(scoreboard()).toEqual(["Lag 1Leder300"]);

  await userEvent.click(undoButton()!);
  expect(tile("Sted", 200)).toBeEnabled();
  expect(tile("Sted", 100)).toBeDisabled();
  expect(scoreboard()).toEqual(["Lag 1Leder100"]);

  await userEvent.click(undoButton()!);
  expect(scoreboard()).toEqual(["Lag 10"]);
  expect(undoButton()).not.toBeInTheDocument();
});

test("angrer riktig lag etter navnebytte", async () => {
  await startGame("Lag 1", "Lag 2");
  await awardPoints("Sted", 300, "Lag 1");
  await click("Meny");
  await click("Endre oppsett");
  const field = screen.getByRole("textbox", { name: "Navn på lag 1" });
  await userEvent.clear(field);
  await userEvent.type(field, "Vinnerne{Enter}");
  await click("Fortsett spillet");

  await userEvent.click(undoButton()!);

  expect(scoreboard()).toEqual(["Vinnerne0", "Lag 20"]);
});

test("gir ingen minuspoeng for runder fra et fjernet lag", async () => {
  await startGame("Lag 1", "Lag 2");
  await awardPoints("Sted", 300, "Lag 1");
  await click("Meny");
  await click("Endre oppsett");
  await click("Fjern Lag 1");
  await userEvent.click(dialogButton("Ja, fjern"));
  // Et nytt lag med samme navn skal ikke arve runden.
  await userEvent.type(
    screen.getByRole("textbox", { name: "Navn på nytt lag" }),
    "Lag 1{Enter}"
  );
  await click(/spillet$/);

  expect(undoButton()).toHaveAccessibleName("Angre: Sted 300 – ingen poeng");
  await userEvent.click(undoButton()!);

  expect(scoreboard()).toEqual(["Lag 20", "Lag 10"]);
  expect(tile("Sted", 300)).toBeEnabled();
});

// --- Meny og slutt ---

test("åpner og lukker menyen", async () => {
  renderScreen("board");
  const button = screen.getByRole("button", { name: "Meny" });
  expect(button).toHaveAttribute("aria-expanded", "false");

  await userEvent.click(button);
  expect(menu()).toBeInTheDocument();
  expect(button).toHaveAttribute("aria-expanded", "true");
  await userEvent.click(button);
  expect(menu()).not.toBeInTheDocument();
});

test("lukker menyen med Escape og gir fokus tilbake", async () => {
  renderScreen("board");
  await click("Meny");
  await userEvent.tab();

  await userEvent.keyboard("{Escape}");

  expect(menu()).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Meny" })).toHaveFocus();
});

test("lukker menyen ved trykk utenfor", async () => {
  renderScreen("board");
  await click("Meny");

  await userEvent.click(screen.getByRole("heading", { level: 1 }));

  expect(menu()).not.toBeInTheDocument();
});

test("har lenker til fasit og spilleliste bare når et spill er valgt", async () => {
  const { unmount } = renderScreen("board");
  await click("Meny");
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  unmount();

  store("gameId", gameInfo[0].id);
  renderScreen("board");
  await click("Meny");

  expect(
    screen.getByRole("link", { name: "Fasit (kun spilleder)" })
  ).toHaveAttribute("href", gameInfo[0].googleDocLink);
  expect(screen.getByRole("link", { name: "Spilleliste" })).toHaveAttribute(
    "href",
    gameInfo[0].spotifyLink
  );
});

// Alle rutene unntatt «Sted 100» er brukt.
function storeLastTile() {
  store("teams", [{ name: "Lag 1", score: 0 }]);
  store("usedTiles", allTiles.slice(1));
}

function resultTitle(name: string) {
  return screen.queryByRole("heading", { level: 1, name });
}

test("går til resultatet når siste poengsum deles ut", async () => {
  storeLastTile();
  renderScreen("board");
  expect(screen.getByText("1 rute igjen")).toBeInTheDocument();

  await awardPoints("Sted", 100, "Lag 1");

  expect(resultTitle("Lag 1")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("går til resultatet også når ingen svarte på den siste", async () => {
  storeLastTile();
  renderScreen("board");

  await awardNoPoints("Sted", 100);

  expect(resultTitle("Ingen vinner ennå")).toBeInTheDocument();
});

test("blir på brettet så lenge det er ruter igjen", async () => {
  store("usedTiles", allTiles.slice(2));
  renderScreen("board");

  await awardNoPoints("Sted", 100);

  expect(screen.getByText("1 rute igjen")).toBeInTheDocument();
});

test("blir på brettet når den siste ruten åpnes og lukkes", async () => {
  storeLastTile();
  renderScreen("board");
  await userEvent.click(tile("Sted", 100));

  await userEvent.click(
    screen.getByRole("button", { name: /Tilbake til brettet/ })
  );

  expect(screen.getByText("1 rute igjen")).toBeInTheDocument();
});

test("kan gå tilbake til brettet og angre den siste runden", async () => {
  storeLastTile();
  renderScreen("board");
  await awardPoints("Sted", 100, "Lag 1");

  await click("Tilbake til brettet");
  expect(screen.getByText("0 ruter igjen")).toBeInTheDocument();
  await userEvent.click(undoButton()!);
  expect(tile("Sted", 100)).toBeEnabled();

  await awardPoints("Sted", 100, "Lag 1");
  expect(resultTitle("Lag 1")).toBeInTheDocument();
});

test("kan gå til resultatet igjen fra et ferdig brett", async () => {
  store("usedTiles", allTiles);
  renderScreen("board");

  await click("Kår vinner");

  expect(
    screen.getByRole("button", { name: "Nytt spill" })
  ).toBeInTheDocument();
});
