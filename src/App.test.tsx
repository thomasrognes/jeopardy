import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { BoardContextProvider } from "./context/BoardContext";
import { TeamsContextProvider } from "./context/TeamContext";

beforeEach(() => {
  window.localStorage.clear();
  document.body.innerHTML = '<div id="modal-root"></div>';
});

function renderApp() {
  return render(
    <TeamsContextProvider>
      <BoardContextProvider>
        <App />
      </BoardContextProvider>
    </TeamsContextProvider>
  );
}

async function addTeam(name: string) {
  await userEvent.click(screen.getByText("Legg til nytt lag"));
  await userEvent.type(screen.getByLabelText(/Lagnavn/), name);
  await userEvent.click(screen.getByText("Fullfør"));
}

// Første rute er «Sted» 100 poeng.
function firstTile() {
  return screen.getAllByRole("button", { name: "100" })[0];
}

function teamRow(name: string) {
  return within(screen.getByRole("cell", { name }).closest("tr")!);
}

test("kan legge til nytt lag", async () => {
  renderApp();

  await addTeam("Lag 1");

  expect(await screen.findByText("Lag 1")).toBeInTheDocument();
});

test("kan ikke legge til to lag med samme navn", async () => {
  renderApp();

  await addTeam("Lag 1");
  await addTeam(" lag 1 ");

  expect(
    screen.getByText("Det finnes allerede et lag med det navnet.")
  ).toBeInTheDocument();
  expect(screen.getAllByRole("cell", { name: /lag 1/i })).toHaveLength(1);
});

test("husker ikke valgt lag etter at dialogen er lukket", async () => {
  renderApp();
  await addTeam("Lag 1");

  await userEvent.click(firstTile());
  await userEvent.selectOptions(screen.getByRole("combobox"), "Lag 1");
  await userEvent.click(document.querySelector(".modal__close-button")!);
  await userEvent.click(firstTile());
  await userEvent.click(screen.getByText("Legg til poeng"));

  expect(screen.getByText("Påkrevd felt.")).toBeInTheDocument();
  expect(teamRow("Lag 1").getByRole("cell", { name: "0" })).toBeInTheDocument();
});

test("husker ikke «Ingen gjettet riktig» etter at dialogen er lukket", async () => {
  renderApp();

  await userEvent.click(firstTile());
  await userEvent.click(screen.getByLabelText("Ingen gjettet riktig."));
  await userEvent.click(document.querySelector(".modal__close-button")!);
  await userEvent.click(firstTile());
  await userEvent.click(screen.getByText("Legg til poeng"));

  expect(screen.getByText("Påkrevd felt.")).toBeInTheDocument();
});

test("beholder spillet etter omlasting, og kan nullstille det", async () => {
  const { unmount } = renderApp();
  await addTeam("Lag 1");
  await userEvent.click(screen.getAllByRole("button", { name: "" })[0]);
  await userEvent.type(screen.getByDisplayValue("Sted"), "er");
  await userEvent.click(firstTile());
  await userEvent.selectOptions(screen.getByRole("combobox"), "Lag 1");
  await userEvent.click(screen.getByText("Legg til poeng"));

  unmount();
  renderApp();

  expect(screen.getByText("Steder")).toBeInTheDocument();
  expect(
    teamRow("Lag 1").getByRole("cell", { name: "100" })
  ).toBeInTheDocument();
  expect(firstTile()).toBeDisabled();

  await userEvent.click(screen.getByText("Nullstill spill"));
  await userEvent.click(screen.getByText("Ja, nullstill"));

  expect(screen.getByText("Sted")).toBeInTheDocument();
  expect(screen.queryByText("Lag 1")).not.toBeInTheDocument();
  expect(firstTile()).toBeEnabled();
});

test("en rute som bare er åpnet, regnes ikke som brukt etter omlasting", async () => {
  const { unmount } = renderApp();
  await userEvent.click(firstTile());

  unmount();
  renderApp();

  expect(firstTile()).toBeEnabled();
});

test("starter blankt hvis lagrede data er ødelagt", () => {
  window.localStorage.setItem("jeopardy.teams", "ikke json");
  window.localStorage.setItem("jeopardy.usedTiles", '{"feil":"form"}');

  renderApp();

  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(firstTile()).toBeEnabled();
});
