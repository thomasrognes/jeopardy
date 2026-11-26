import { expect, test } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import gameInfo from "../../json/gameInfo.json";
import {
  addTeam,
  click,
  dialogButton,
  newTeamField,
  renderScreen,
  renderWithProviders,
  store,
  teamNames,
} from "../../testUtils";

const emptyNameError = "Lagnavn kan ikke være tomt.";
const duplicateNameError = "Det finnes allerede et lag med det navnet.";

function teamField(number: number) {
  return screen.getByRole("textbox", { name: `Navn på lag ${number}` });
}

function categoryField(number: number) {
  return screen.getByRole("textbox", { name: `Kategori ${number}` });
}

function gameButton(name: string) {
  return screen.getByRole("button", { name });
}

// --- Slik spiller du ---

function howToPlay() {
  return screen.queryByRole("dialog", { name: "Slik spiller du" });
}

test("viser spillereglene bare når man ber om dem", async () => {
  renderScreen("setup");
  expect(howToPlay()).not.toBeInTheDocument();

  await click("Slik spiller du");

  expect(within(howToPlay()!).getAllByRole("listitem").length).toBeGreaterThan(
    0
  );
  await click("Lukk");
  expect(howToPlay()).not.toBeInTheDocument();
});

// --- Lag ---

test("legger til lag med Enter og med knappen", async () => {
  renderWithProviders();

  await addTeam("Lag 1");
  await userEvent.type(newTeamField(), "  Lag 2  ");
  await click("Legg til");

  expect(teamNames()).toEqual(["Lag 1", "Lag 2"]);
  expect(newTeamField()).toHaveValue("");
  expect(newTeamField()).toHaveFocus();
});

test("har ingen grense på antall lag", async () => {
  renderWithProviders();

  for (let number = 1; number <= 9; number++) {
    await addTeam(`Lag ${number}`);
  }

  expect(teamNames()).toHaveLength(9);
});

test.each(["", "   "])("avviser et nytt lag uten navn («%s»)", async (name) => {
  renderWithProviders();
  if (name) {
    await userEvent.type(newTeamField(), name);
  }

  await click("Legg til");

  expect(newTeamField()).toHaveAccessibleDescription(emptyNameError);
  expect(teamNames()).toEqual([]);
});

test.each(["Lag 1", "lag 1", " LAG 1 "])(
  "avviser nytt lag «%s» når «Lag 1» finnes",
  async (name) => {
    renderWithProviders();
    await addTeam("Lag 1");

    await addTeam(name);

    expect(screen.getByText(duplicateNameError)).toBeInTheDocument();
    expect(teamNames()).toEqual(["Lag 1"]);
  }
);

test("fjerner feilmeldingen når navnet endres", async () => {
  renderWithProviders();
  await addTeam("Lag 1");
  await addTeam("Lag 1");

  await userEvent.type(newTeamField(), "0{Enter}");

  expect(screen.queryByText(duplicateNameError)).not.toBeInTheDocument();
  expect(teamNames()).toEqual(["Lag 1", "Lag 10"]);
});

test.each([
  ["Enter", "{Enter}"],
  ["Tab", "{Tab}"],
])("lagrer nytt lagnavn med %s", async (_, key) => {
  const { unmount } = renderWithProviders();
  await addTeam("Lag 1");

  await userEvent.clear(teamField(1));
  await userEvent.type(teamField(1), ` Vinnerne ${key}`);
  unmount();
  renderWithProviders();

  expect(teamNames()).toEqual(["Vinnerne"]);
});

test("kan endre bare store og små bokstaver i eget navn", async () => {
  renderWithProviders();
  await addTeam("Lag 1");

  await userEvent.clear(teamField(1));
  await userEvent.type(teamField(1), "LAG 1{Enter}");

  expect(teamNames()).toEqual(["LAG 1"]);
});

test.each([
  ["", emptyNameError],
  ["lag 2", duplicateNameError],
])("beholder det gamle navnet når nytt navn er «%s»", async (name, error) => {
  renderWithProviders();
  await addTeam("Lag 1");
  await addTeam("Lag 2");

  await userEvent.clear(teamField(1));
  if (name) {
    await userEvent.type(teamField(1), name);
  }
  expect(teamField(1)).toHaveAccessibleDescription(error);
  await userEvent.tab();

  expect(teamNames()).toEqual(["Lag 1", "Lag 2"]);
  expect(screen.queryByText(error)).not.toBeInTheDocument();
});

test("fjerner et nytt lag direkte, og radene under følger med", async () => {
  renderWithProviders();
  await addTeam("Lag 1");
  await addTeam("Lag 2");
  await addTeam("Lag 3");

  await click("Fjern Lag 2");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(teamNames()).toEqual(["Lag 1", "Lag 3"]);
});

test("ber om bekreftelse før et lag med poeng fjernes", async () => {
  store("teams", [{ name: "Lag 1", score: 300 }]);
  renderWithProviders();

  await click("Fjern Lag 1");
  expect(
    screen.getByText("Vil du fjerne «Lag 1»? Laget og poengene slettes.")
  ).toBeInTheDocument();
  await userEvent.click(dialogButton("Avbryt"));
  expect(teamNames()).toEqual(["Lag 1"]);

  await click("Fjern Lag 1");
  await userEvent.click(dialogButton("Ja, fjern"));
  expect(teamNames()).toEqual([]);
});

test("har Avbryt som første knapp i bekreftelsen", async () => {
  store("teams", [{ name: "Lag 1", score: 300 }]);
  renderWithProviders();

  await click("Fjern Lag 1");

  const [first] = within(screen.getByRole("dialog")).getAllByRole("button");
  expect(first).toHaveAccessibleName("Avbryt");
});

// --- Kategorier ---

test("viser standardnavnene og lagrer nye", async () => {
  const { unmount } = renderWithProviders();
  expect(categoryField(3)).toHaveValue("Mat og drikke");

  await userEvent.clear(categoryField(1));
  await userEvent.type(categoryField(1), "Film");
  unmount();
  renderWithProviders();

  expect(categoryField(1)).toHaveValue("Film");
});

test.each(["", "   "])(
  "gir standardnavnet tilbake når feltet forlates som «%s»",
  async (typed) => {
    renderWithProviders();

    await userEvent.clear(categoryField(1));
    if (typed) {
      await userEvent.type(categoryField(1), typed);
    }
    await userEvent.tab();

    expect(categoryField(1)).toHaveValue("Sted");
  }
);

// --- Spill ---

test("viser alle spillene uten valg og lenker", () => {
  renderWithProviders();

  for (const game of gameInfo) {
    expect(gameButton(game.name)).toHaveAttribute("aria-pressed", "false");
  }
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

test.each(gameInfo)("viser lenkene til «$name»", async (game) => {
  renderWithProviders();

  await userEvent.click(gameButton(game.name));

  expect(gameButton(game.name)).toHaveAttribute("aria-pressed", "true");
  const answers = screen.getByRole("link", { name: "Åpne fasit" });
  const songs = screen.getByRole("link", { name: "Åpne spilleliste" });
  expect(answers).toHaveAttribute("href", game.googleDocLink);
  expect(songs).toHaveAttribute("href", game.spotifyLink);
  for (const link of [answers, songs]) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  }
});

test("husker valgt spill, og et nytt trykk fjerner valget", async () => {
  const { unmount } = renderWithProviders();
  await userEvent.click(gameButton(gameInfo[1].name));
  unmount();
  renderWithProviders();
  expect(gameButton(gameInfo[1].name)).toHaveAttribute("aria-pressed", "true");

  await userEvent.click(gameButton(gameInfo[1].name));

  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

// --- Start og nytt spill ---

test("oppsummerer valget under startknappen", async () => {
  renderWithProviders();
  await addTeam("Lag 1");

  await userEvent.click(gameButton(gameInfo[1].name));

  expect(screen.getByText(`${gameInfo[1].name} · 1 lag`)).toBeInTheDocument();
});

function startButton() {
  return screen.getByRole("button", { name: /^(Start|Fortsett) spillet$/ });
}

const noTeamsHint = "Legg til minst ett lag for å starte.";

test("kan ikke starte uten lag", async () => {
  renderWithProviders();
  expect(startButton()).toBeDisabled();
  expect(startButton()).toHaveAccessibleDescription(noTeamsHint);

  await userEvent.click(startButton());

  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});

test("kan starte når det finnes et lag, til det fjernes igjen", async () => {
  renderWithProviders();

  await addTeam("Lag 1");
  expect(startButton()).toBeEnabled();
  expect(screen.queryByText(noTeamsHint)).not.toBeInTheDocument();

  await click("Fjern Lag 1");
  expect(startButton()).toBeDisabled();
});

test("kan ikke fortsette et spill når alle lagene er fjernet", () => {
  store("usedTiles", ["Sted-100"]);
  renderWithProviders();

  expect(startButton()).toHaveAccessibleName("Fortsett spillet");
  expect(startButton()).toBeDisabled();
});

test("tilbyr ikke nytt spill før noe er spilt", () => {
  renderWithProviders();

  expect(
    screen.queryByRole("button", { name: "Nytt spill" })
  ).not.toBeInTheDocument();
});

test("nullstiller poeng og ruter, men beholder lag og kategorier", async () => {
  store("teams", [{ name: "Lag 1", score: 300 }]);
  store("categoryNames", { Sted: "Film" });
  store("usedTiles", ["Sted-300"]);
  renderScreen("setup");
  await click("Nytt spill");
  await userEvent.click(dialogButton("Avbryt"));
  expect(
    screen.getByRole("button", { name: "Fortsett spillet" })
  ).toBeInTheDocument();

  await click("Nytt spill");
  await userEvent.click(dialogButton("Start på nytt"));

  expect(teamNames()).toEqual(["Lag 1"]);
  expect(categoryField(1)).toHaveValue("Film");
  await click("Start spillet");
  expect(screen.getByText("20 ruter igjen")).toBeInTheDocument();
});
