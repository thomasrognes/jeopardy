import { expect, test } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  category,
  closeModal,
  editButton,
  renameCategory,
  renderWithProviders,
  tile,
} from "../../testUtils";

test("bytter mellom visning og redigering med blyantknappen", async () => {
  renderWithProviders();
  const column = category("Sted");

  await userEvent.click(editButton(column));
  expect(within(column).getByRole("textbox")).toHaveValue("Sted");
  expect(within(column).queryByRole("heading")).not.toBeInTheDocument();

  await userEvent.click(editButton(column));
  expect(within(column).queryByRole("textbox")).not.toBeInTheDocument();
  expect(within(column).getByRole("heading")).toHaveTextContent("Sted");
});

test("endrer bare navnet på den valgte kategorien", async () => {
  renderWithProviders();

  await renameCategory("Sted", "Film");

  expect(
    screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)
  ).toEqual(["Film", "Tall", "Mat og drikke", "Tid"]);
});

test("bruker det nye navnet i poengdialogen", async () => {
  renderWithProviders();
  await renameCategory("Sted", "Film");

  await userEvent.click(tile("Film", 300));

  expect(
    screen.getByRole("heading", { name: "Film 300 poeng" })
  ).toBeInTheDocument();
});

test("beholder brukte ruter når kategorien får nytt navn", async () => {
  renderWithProviders();
  await userEvent.click(tile("Sted", 100));
  await userEvent.click(screen.getByLabelText("Ingen gjettet riktig."));
  await userEvent.click(screen.getByText("Legg til poeng"));

  await renameCategory("Sted", "Film");

  expect(tile("Film", 100)).toBeDisabled();
  expect(tile("Film", 200)).toBeEnabled();
});

test("holder rutene adskilt selv om to kategorier får samme navn", async () => {
  renderWithProviders();
  await renameCategory("Sted", "Tall");
  const [first, second] = screen.getAllByRole("group", { name: "Tall" });

  await userEvent.click(within(first).getByRole("button", { name: "100" }));
  await closeModal();
  await userEvent.click(within(first).getByRole("button", { name: "100" }));
  await userEvent.click(screen.getByLabelText("Ingen gjettet riktig."));
  await userEvent.click(screen.getByText("Legg til poeng"));

  expect(within(first).getByRole("button", { name: "100" })).toBeDisabled();
  expect(within(second).getByRole("button", { name: "100" })).toBeEnabled();
});
