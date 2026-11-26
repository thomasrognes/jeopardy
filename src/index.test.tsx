import { expect, test } from "vitest";
import { act } from "react";
import { screen } from "@testing-library/react";

// Fanger opp feil i oppkoblingen, for eksempel en context-provider som mangler.
test("starter appen i #root", async () => {
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);

  await act(async () => {
    await import("./index");
  });

  expect(root).toContainElement(screen.getByText("Legg til nytt lag"));
});
