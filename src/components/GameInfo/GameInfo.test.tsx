import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import gameInfo from "../../json/gameInfo.json";
import { GameInfo } from "./GameInfo";

function gameSelect() {
  return screen.getByRole("combobox", { name: "Velg spill" });
}

test("lister alle spillene, uten at noe er valgt", () => {
  render(<GameInfo />);

  expect(
    screen.getAllByRole("option").map((option) => option.textContent)
  ).toEqual(["", ...gameInfo.map((game) => game.name)]);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

test.each(gameInfo)("viser informasjon og lenker for «$name»", async (game) => {
  render(<GameInfo />);

  await userEvent.selectOptions(gameSelect(), game.name);

  expect(
    screen.getByText("NB! Kategoriene må endres manuelt.")
  ).toBeInTheDocument();

  const answers = screen.getByRole("link", { name: "Fasit (Google docs)" });
  const songs = screen.getByRole("link", { name: "Sanger (Spotify)" });
  expect(answers).toHaveAttribute("href", game.googleDocLink);
  expect(songs).toHaveAttribute("href", game.spotifyLink);
  for (const link of [answers, songs]) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  }
});

test("skjuler informasjonen når valget settes tilbake til tomt", async () => {
  render(<GameInfo />);
  await userEvent.selectOptions(gameSelect(), gameInfo[0].name);

  await userEvent.selectOptions(gameSelect(), "");

  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

test("husker valgt spill når det åpnes på nytt", async () => {
  const { unmount } = render(<GameInfo />);
  await userEvent.selectOptions(gameSelect(), gameInfo[1].name);

  unmount();
  render(<GameInfo />);

  expect(gameSelect()).toHaveValue(String(gameInfo[1].id));
  expect(
    screen.getByRole("link", { name: "Fasit (Google docs)" })
  ).toHaveAttribute("href", gameInfo[1].googleDocLink);
});

test("husker også at valget er fjernet", async () => {
  const { unmount } = render(<GameInfo />);
  await userEvent.selectOptions(gameSelect(), gameInfo[0].name);
  await userEvent.selectOptions(gameSelect(), "");

  unmount();
  render(<GameInfo />);

  expect(gameSelect()).toHaveValue("");
});

test.each(["ikke json", '"1"', "999"])(
  "har ikke noe valg når lagret verdi er %s",
  (stored) => {
    window.localStorage.setItem("jeopardy.gameId", stored);

    render(<GameInfo />);

    expect(gameSelect()).toHaveValue("");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  }
);
