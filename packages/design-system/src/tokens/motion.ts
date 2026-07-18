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
  /**
   * Not from Figma's prototype (its AFTER_TIMEOUT trigger just cuts
   * instantly between slides) — added so the Features carousel crossfades
   * instead of hard-cutting. Reuses the "Gentle" curve above for the same
   * smooth-decel feel as the rest of the system.
   */
  featureCrossfade: {
    duration: "1200ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  // Widened from Figma's literal 5s AFTER_TIMEOUT — 8s reads less rushed
  // and gives the crossfade above room to land before the next cut.
  // The active dot's fill indicator animates over this same duration.
  carouselInterval: 8000,
} as const;
