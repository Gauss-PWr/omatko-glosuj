import { describe, expect, test } from "vitest";
import { withBase } from "./url";

describe("withBase", () => {
  test("prefixes paths with the base", () => {
    expect(withBase("/glosuj", "/login")).toBe("/glosuj/login");
    expect(withBase("/glosuj", "/")).toBe("/glosuj/");
    expect(withBase("/glosuj", "/?panel=day-0")).toBe("/glosuj/?panel=day-0");
  });

  test("tolerates a trailing slash in the base", () => {
    expect(withBase("/glosuj/", "/login")).toBe("/glosuj/login");
  });

  test("adds a missing leading slash", () => {
    expect(withBase("/glosuj", "login")).toBe("/glosuj/login");
  });

  test("works at the site root", () => {
    expect(withBase("/", "/login")).toBe("/login");
    expect(withBase("", "/login")).toBe("/login");
  });

  test("empty path gives the cookie path", () => {
    expect(withBase("/glosuj", "")).toBe("/glosuj");
    expect(withBase("/", "")).toBe("/");
  });
});
