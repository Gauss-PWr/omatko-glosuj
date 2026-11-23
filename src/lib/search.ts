/** Lowercase, strip diacritics (incl. Polish ł) for forgiving matching. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l");
}

/** True when every word of `query` occurs in `text`; empty query matches all. */
export function matches(query: string, text: string): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(text);
  return words.every((word) => haystack.includes(word));
}
