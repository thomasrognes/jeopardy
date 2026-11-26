import { expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addTeam,
  awardPoints,
  closeModal,
  dialogButton,
  leaderBoard,
  renderWithProviders,
  tile,
} from "../../testUtils";

async function renderWithTeams() {
  const view = renderWithProviders();
  await addTeam("Lag 1");
  await addTeam("Lag 2");
  await awardPoints("Sted", 300, "Lag 1");
  return view;
}

function edit(teamName: string) {
  return userEvent.click(
    screen.getByRole("button", { name: `Rediger ${teamName}` })
  );
}

function nameField() {
  return screen.getByRole("textbox", { name: "Lagnavn" });
}

async function rename(from: string, to: string) {
  await edit(from);
  await userEvent.clear(nameField());
  if (to) {
    await userEvent.type(nameField(), to);
  }
  await userEvent.click(dialogButton("Lagre"));
}

async function remove(teamName: string) {
  await edit(teamName);
  await userEvent.click(dialogButton("Fjern lag"));
  await userEvent.click(dialogButton("Ja, fjern"));
}

function undoButton() {
  return screen.getByRole("button", { name: /^Angre/ });
}

const unchanged = [
  ["1", "Lag 1", "300"],
  ["2", "Lag 2", "0"],
];

test("åpner dialogen med lagets navn", async () => {
  await renderWithTeams();

  await edit("Lag 2");

  expect(
    screen.getByRole("dialog", { name: "Rediger lag" })
  ).toBeInTheDocument();
  expect(nameField()).toHaveValue("Lag 2");
});

test("gir laget nytt navn og beholder poengene", async () => {
  await renderWithTeams();

  await rename("Lag 1", "  Vinnerne  ");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(leaderBoard()).toEqual([
    ["1", "Vinnerne", "300"],
    ["2", "Lag 2", "0"],
  ]);
});

test("lagrer når man trykker Enter", async () => {
  await renderWithTeams();
  await edit("Lag 2");

  await userEvent.type(nameField(), "0{Enter}");

  expect(leaderBoard()[1]).toEqual(["2", "Lag 20", "0"]);
});

test("kan endre bare store og små bokstaver i eget navn", async () => {
  await renderWithTeams();

  await rename("Lag 1", "LAG 1");

  expect(leaderBoard()[0]).toEqual(["1", "LAG 1", "300"]);
});

test.each([
  ["", "Lagnavn kan ikke være tomt."],
  ["lag 2", "Det finnes allerede et lag med det navnet."],
])("avviser navnet «%s»", async (name, error) => {
  await renderWithTeams();

  await rename("Lag 1", name);

  expect(screen.getByText(error)).toBeInTheDocument();
  expect(leaderBoard()).toEqual(unchanged);
});

test("endrer ingenting når dialogen lukkes", async () => {
  await renderWithTeams();
  await edit("Lag 1");
  await userEvent.type(nameField(), " nytt");

  await closeModal();

  expect(leaderBoard()).toEqual(unchanged);
});

test("angrer riktig lag etter navnebytte", async () => {
  await renderWithTeams();

  await rename("Lag 1", "Vinnerne");
  expect(undoButton()).toHaveAccessibleName("Angre: Sted 300 – Vinnerne");
  await userEvent.click(undoButton());

  expect(leaderBoard()).toEqual([
    ["1", "Vinnerne", "0"],
    ["2", "Lag 2", "0"],
  ]);
});

test("ber om bekreftelse med fokus på Avbryt før et lag fjernes", async () => {
  await renderWithTeams();
  await edit("Lag 1");

  await userEvent.click(dialogButton("Fjern lag"));

  expect(
    screen.getByText("Vil du fjerne «Lag 1»? Laget og poengene slettes.")
  ).toBeInTheDocument();
  expect(dialogButton("Avbryt")).toHaveFocus();

  await userEvent.click(dialogButton("Avbryt"));
  expect(nameField()).toHaveValue("Lag 1");
  expect(nameField()).toHaveFocus();
  expect(leaderBoard()).toEqual(unchanged);
});

test("fjerner bare det valgte laget", async () => {
  await renderWithTeams();

  await remove("Lag 1");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(leaderBoard()).toEqual([["1", "Lag 2", "0"]]);

  await userEvent.click(tile("Tall", 100));
  expect(
    screen.queryByRole("button", { name: "Lag 1" })
  ).not.toBeInTheDocument();
});

test("kan angre en runde fra et fjernet lag uten å gi andre minuspoeng", async () => {
  await renderWithTeams();
  await remove("Lag 1");
  // Et nytt lag med samme navn skal ikke arve runden.
  await addTeam("Lag 1");

  expect(undoButton()).toHaveAccessibleName("Angre: Sted 300 – ingen poeng");
  await userEvent.click(undoButton());

  expect(leaderBoard()).toEqual([
    ["1", "Lag 2", "0"],
    ["2", "Lag 1", "0"],
  ]);
  expect(tile("Sted", 300)).toBeEnabled();
});

test("husker endringene etter omlasting", async () => {
  const { unmount } = await renderWithTeams();
  await rename("Lag 1", "Vinnerne");
  await remove("Lag 2");

  unmount();
  renderWithProviders();

  expect(leaderBoard()).toEqual([["1", "Vinnerne", "300"]]);
  expect(undoButton()).toHaveAccessibleName("Angre: Sted 300 – Vinnerne");
});
