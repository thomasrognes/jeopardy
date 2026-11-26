import { expect, test, vi } from "vitest";
import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

function renderModal() {
  const onClose = vi.fn();
  const view = render(
    <Modal title="Tittel" onClose={onClose}>
      <p>Innhold</p>
    </Modal>
  );
  return { ...view, onClose };
}

// Lar eventuelle ventende close-hendelser bli levert.
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve));
}

test("åpnes som modal dialog med tittelen som navn", () => {
  const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");

  renderModal();

  expect(screen.getByRole("dialog", { name: "Tittel" })).toHaveAttribute(
    "open"
  );
  expect(screen.getByText("Innhold")).toBeInTheDocument();
  expect(showModal).toHaveBeenCalledTimes(1);
});

test("rendres utenfor komponenten som bruker den", () => {
  const { container } = renderModal();

  expect(container).toBeEmptyDOMElement();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("lukker dialogen før den fjernes", () => {
  const close = vi.spyOn(HTMLDialogElement.prototype, "close");
  const { unmount } = renderModal();

  unmount();

  expect(close).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("ber om å lukkes når krysset trykkes", async () => {
  const { onClose } = renderModal();

  await userEvent.click(screen.getByRole("button", { name: "Lukk" }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

// Slik lukker nettleseren dialogen når man trykker Escape.
test("gir beskjed når nettleseren lukker dialogen", async () => {
  const { onClose } = renderModal();

  screen.getByRole<HTMLDialogElement>("dialog").close();

  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test("forblir åpen i Strict Mode", async () => {
  const onClose = vi.fn();

  render(
    <StrictMode>
      <Modal title="Tittel" onClose={onClose}>
        <p>Innhold</p>
      </Modal>
    </StrictMode>
  );
  await nextTask();

  expect(screen.getByRole("dialog")).toHaveAttribute("open");
  expect(onClose).not.toHaveBeenCalled();
});
