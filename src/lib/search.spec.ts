import { describe, expect, test } from "vitest";
import { matches, normalize } from "./search";

describe("search", () => {
  test("normalizes case and Polish diacritics", () => {
    expect(normalize("Łódź ŻÓŁW")).toBe("lodz zolw");
  });

  test("empty query matches everything", () => {
    expect(matches("", "anything")).toBe(true);
    expect(matches("   ", "anything")).toBe(true);
  });

  test("matches ignoring case and diacritics", () => {
    expect(matches("lodz", "Wycieczka do Krakowa")).toBe(false);
    expect(matches("lodz", "Miasto Łódź")).toBe(true);
    expect(matches("ŁÓDŹ", "miasto lodz")).toBe(true);
  });

  test("requires every word, in any order", () => {
    expect(matches("graf dyfuzja", "Modele dyfuzja na grafach")).toBe(true);
    expect(matches("graf kot", "Modele dyfuzja na grafach")).toBe(false);
  });
});
