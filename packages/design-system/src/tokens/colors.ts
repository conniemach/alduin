/**
 * Design tokens: colors.
 * Change values here to update the palette everywhere the design system
 * and the site are used — both consume this same source.
 */
export const colors = {
  brand: {
    50: "#f2f0ff",
    100: "#e6e1ff",
    200: "#c4b8ff",
    300: "#a28eff",
    400: "#8164ff",
    500: "#6238ff",
    600: "#4f26e0",
    700: "#3d1cb3",
    800: "#2c1486",
    900: "#1c0c59",
  },
  neutral: {
    0: "#ffffff",
    50: "#f7f7f8",
    100: "#eeeef0",
    200: "#d9d9de",
    300: "#b8b8c0",
    400: "#8f8f9a",
    500: "#6b6b76",
    600: "#4f4f59",
    700: "#3a3a42",
    800: "#26262c",
    900: "#141417",
    1000: "#000000",
  },
  success: "#1ca551",
  warning: "#c98a04",
  danger: "#d93636",
} as const;
