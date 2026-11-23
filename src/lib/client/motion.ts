import { cubicInOut } from "svelte/easing";
import type { EasingFunction, TransitionConfig } from "svelte/transition";
import { ui } from "./ballot.svelte";

/**
 * Duration for UI transitions: 0 until the initial server state has been
 * applied (so restored picks don't animate on page load) and for users who
 * prefer reduced motion.
 */
export function ms(duration: number): number {
  if (!ui.animate) return 0;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return 0;
  }
  return duration;
}

/**
 * Collapses/expands and fades at the same time. Height follows one shared
 * curve, so siblings that grow while another collapses (ratings opening as the
 * other talk closes) offset each other smoothly.
 */
export function fadeCollapse(
  node: Element,
  {
    duration = 320,
    easing = cubicInOut,
    lead = 0.5,
  }: { duration?: number; easing?: EasingFunction; lead?: number } = {},
): TransitionConfig {
  const style = getComputedStyle(node);
  const opacity = Number(style.opacity);
  const height = parseFloat(style.height);
  const sides = [
    "paddingTop",
    "paddingBottom",
    "marginTop",
    "marginBottom",
    "borderTopWidth",
    "borderBottomWidth",
  ] as const;
  const sizes = sides.map((side) => parseFloat(style[side]));

  return {
    duration,
    easing,
    css: (t) => {
      // Opacity is 0 until the element is `lead` open, then reaches 1 when
      // fully open. A high lead hides content before clipping crops it.
      const fade = Math.min(1, Math.max(0, (t - lead) / (1 - lead)));
      const size = t;
      return [
        "overflow: hidden;",
        `opacity: ${opacity * fade};`,
        `height: ${height * size}px;`,
        ...sides.map(
          (side, i) =>
            `${side.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${(sizes[i] ?? 0) * size}px;`,
        ),
      ].join(" ");
    },
  };
}

type Params = { duration?: number; easing?: EasingFunction };

/** Leaving content is invisible before the clipped box visibly shrinks. */
export function collapse(node: Element, params: Params = {}) {
  return fadeCollapse(node, { ...params, lead: 0.75 });
}

/** Entering content starts to appear early in the expansion. */
export function expand(node: Element, params: Params = {}) {
  return fadeCollapse(node, { ...params, lead: 0.25 });
}
