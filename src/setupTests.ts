// Legger til DOM-sjekker som toBeInTheDocument() på expect().
import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
  // Modalene rendres i en portal utenfor appen, slik som i public/index.html.
  document.body.innerHTML = '<div id="modal-root"></div>';
});
