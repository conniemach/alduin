/**
 * Corner radius values observed in the Figma components.
 * "full" covers pill buttons and carousel dots (radius >= half of height).
 */
export const radius = {
  none: "0px",
  sm: "4px",
  md: "10px",
  lg: "20px",
  full: "9999px",
} as const;

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
} as const;
