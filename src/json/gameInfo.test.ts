import { expect, test } from "vitest";
import gameInfo from "./gameInfo.json";

// Vokter mot skrivefeil når nye spill legges inn for hånd.
test("har unike id-er og navn", () => {
  const ids = gameInfo.map((game) => game.id);
  const names = gameInfo.map((game) => game.name);

  expect(new Set(ids).size).toBe(ids.length);
  expect(new Set(names).size).toBe(names.length);
});

test.each(gameInfo)("«$name» har gyldige felter", (game) => {
  expect(Number.isInteger(game.id)).toBe(true);
  expect(game.name.trim()).not.toBe("");
  expect(game.googleDocLink).toMatch(
    /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]+/
  );
  expect(game.spotifyLink).toMatch(
    /^https:\/\/open\.spotify\.com\/playlist\/\w+/
  );
});
