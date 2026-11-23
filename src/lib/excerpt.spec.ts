import { describe, expect, test } from "vitest";
import { excerpt } from "./excerpt";

describe("excerpt", () => {
  test("keeps short text, collapsing whitespace", () => {
    expect(excerpt("  a \n\n b\tc ", 5)).toBe("a b c");
  });

  test("cuts at the word limit and adds an ellipsis", () => {
    expect(excerpt("one two three four", 3)).toBe("one two three…");
  });

  test("does not cut text of exactly the limit", () => {
    expect(excerpt("one two three", 3)).toBe("one two three");
  });

  test("drops trailing punctuation before the ellipsis", () => {
    expect(excerpt("one two, three four", 2)).toBe("one two…");
  });

  test("handles empty text", () => {
    expect(excerpt("   ")).toBe("");
  });
});
