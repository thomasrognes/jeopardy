import { expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePersistedState } from "./usePersistedState";

const isNumber = (value: unknown): value is number => typeof value === "number";

function renderCounter() {
  return renderHook(() => usePersistedState("teller", 0, isNumber));
}

test("starter med startverdien når ingenting er lagret", () => {
  const { result } = renderCounter();

  expect(result.current[0]).toBe(0);
});

test("leser en lagret verdi", () => {
  window.localStorage.setItem("teller", "42");

  const { result } = renderCounter();

  expect(result.current[0]).toBe(42);
});

test("lagrer nye verdier", () => {
  const { result } = renderCounter();

  act(() => result.current[1](7));
  act(() => result.current[1]((value) => value + 1));

  expect(result.current[0]).toBe(8);
  expect(window.localStorage.getItem("teller")).toBe("8");
});

test.each([
  ["ugyldig JSON", "{ikke json"],
  ["feil type", '"42"'],
])("bruker startverdien når lagret verdi har %s", (_, stored) => {
  window.localStorage.setItem("teller", stored);

  const { result } = renderCounter();

  expect(result.current[0]).toBe(0);
});

test("virker selv om lagringen ikke kan leses", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("SecurityError");
  });

  const { result } = renderCounter();

  expect(result.current[0]).toBe(0);
});

test("virker selv om lagringen ikke kan skrives til", () => {
  const setItem = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
  const { result } = renderCounter();

  act(() => result.current[1](7));

  expect(setItem).toHaveBeenCalled();
  expect(result.current[0]).toBe(7);
});
