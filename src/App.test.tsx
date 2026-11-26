import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { TeamsContextProvider } from "./context/TeamContext";

test("kan legge til nytt lag", async () => {
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.appendChild(modalRoot);

  render(
    <TeamsContextProvider>
      <App />
    </TeamsContextProvider>
  );

  await userEvent.click(screen.getByText("Legg til nytt lag"));
  await userEvent.type(screen.getByLabelText(/Lagnavn/), "Lag 1");
  await userEvent.click(screen.getByText("Fullfør"));

  expect(await screen.findByText("Lag 1")).toBeInTheDocument();
});
