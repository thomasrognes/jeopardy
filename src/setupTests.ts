// Legger til DOM-sjekker som toBeInTheDocument() på expect().
import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

// jsdom mangler metodene på <dialog>. Som i nettleseren kommer close-hendelsen
// asynkront.
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
HTMLDialogElement.prototype.close = function () {
  if (!this.open) {
    return;
  }
  this.open = false;
  setTimeout(() => this.dispatchEvent(new Event("close")));
};

beforeEach(() => {
  window.localStorage.clear();
});
