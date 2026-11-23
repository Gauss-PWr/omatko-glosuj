/** First `maxWords` words of `text` on one line, with "…" when cut. */
export function excerpt(text: string, maxWords = 50): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words
    .slice(0, maxWords)
    .join(" ")
    .replace(/[.,;:–—-]+$/, "")}…`;
}
