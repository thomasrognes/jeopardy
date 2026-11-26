import { beforeEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

// Elementet testen selv lager, slik at portalen kan sjekkes direkte.
let modalRoot: HTMLElement;

beforeEach(() => {
  modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.replaceChildren(modalRoot);
});

function renderModal() {
  const onDialogToggle = vi.fn();
  const view = render(
    <Modal title="Tittel" hidden={false} onDialogToggle={onDialogToggle}>
      <p>Innhold</p>
    </Modal>
  );
  return { ...view, onDialogToggle };
}

test("rendrer tittel og innhold i #modal-root", () => {
  const { container } = renderModal();

  expect(modalRoot).toContainElement(screen.getByRole("dialog"));
  expect(modalRoot).toContainElement(
    screen.getByRole("heading", { name: "Tittel" })
  );
  expect(modalRoot).toContainElement(screen.getByText("Innhold"));
  expect(container).toBeEmptyDOMElement();
});

test("fjerner innholdet når den avmonteres", () => {
  const { unmount } = renderModal();

  unmount();

  expect(modalRoot).toBeEmptyDOMElement();
});

test("ber om å lukkes når krysset trykkes", async () => {
  const { onDialogToggle } = renderModal();

  await userEvent.click(screen.getByRole("button", { name: "Lukk" }));

  expect(onDialogToggle).toHaveBeenCalledTimes(1);
});

test("ber om å lukkes med Escape", async () => {
  const { onDialogToggle } = renderModal();

  await userEvent.keyboard("{Escape}");

  expect(onDialogToggle).toHaveBeenCalledTimes(1);
});

test("kaster en feil hvis #modal-root mangler", () => {
  modalRoot.remove();
  // React logger feilen i tillegg til å kaste den.
  vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => renderModal()).toThrow("DOM element to render modal in");
});
