/**
 * Design tokens: colors.
 * Pulled directly from the "Styles" frame in Figma (Alduin Design System).
 * The palette is intentionally monochrome — no brand hue, just a
 * grayscale ramp from white to black. Change values here to update
 * color everywhere the design system and the site are used.
 */
export const colors = {
  white: "#ffffff",
  neutral: {
    100: "#e9e9e9",
    150: "#dcdcdc",
    200: "#d1d1d1",
    500: "#6f6f6f",
    700: "#393939",
    800: "#282828",
    850: "#272727",
    900: "#000000",
  },
  black: "#000000",
} as const;
