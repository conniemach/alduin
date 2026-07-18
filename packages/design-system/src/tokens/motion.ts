/**
 * Transition timing, read directly off the Figma prototype's hover/click
 * interactions on each component (Figma's Inspect panel exposes these
 * per-component, not just as generic guesses).
 *
 * Figma's "Gentle" is a spring curve, not a simple curve; the two "gentle"
 * hovers below (Button, ButtonLinkout) are noticeably slower than a
 * typical UI hover (~1s vs. the usual ~150-300ms) — that appears to be a
 * deliberate, unhurried feel for the two primary CTAs specifically.
 * Everything else in the file uses a standard fast 300ms hover/click.
 * cubic-bezier(0.22, 1, 0.36, 1) is the closest standard CSS easing
 * approximation of Figma's "Gentle" spring (smooth decel, no overshoot).
 */
export const motion = {
  buttonHover: {
    duration: "1022ms",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  buttonLinkoutHover: {
    duration: "894ms",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  tabHover: {
    duration: "1022ms",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  quick: {
    duration: "300ms",
    easing: "ease-out",
  },
  quickInOut: {
    duration: "300ms",
    easing: "ease-in-out",
  },
  carouselInterval: 5000,
} as const;
