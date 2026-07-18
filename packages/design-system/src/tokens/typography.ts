/**
 * Type system pulled from the "Text" section of the Figma Styles frame.
 *
 * One substitution: the Figma "Header" style specifies the font
 * "Damascus", a macOS system font (Apple's Arabic-script face) that is
 * not available as a web font. We substitute Manrope, a geometric sans
 * with a similar clean/rounded feel, so the hero headline actually
 * renders for site visitors. Everything else is used as specified.
 */
export const fontFamily = {
  display: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
  mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
  condensed: ["IBM Plex Sans Condensed", "ui-sans-serif", "sans-serif"],
  sans: ["42dot Sans", "ui-sans-serif", "system-ui", "sans-serif"],
  logotype: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
  wordmark: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
} as const;

export const textStyles = {
  display: {
    fontFamily: fontFamily.display,
    fontWeight: 400,
    fontSize: "80px",
    lineHeight: "104px",
    letterSpacing: "0px",
  },
  headingLg: {
    fontFamily: fontFamily.mono,
    fontWeight: 400,
    fontSize: "32px",
    lineHeight: "38.4px",
    letterSpacing: "0px",
  },
  headingCondensed: {
    fontFamily: fontFamily.condensed,
    fontWeight: 400,
    fontSize: "28px",
    lineHeight: "33.6px",
    letterSpacing: "0px",
  },
  headingSm: {
    fontFamily: fontFamily.mono,
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "21.6px",
    letterSpacing: "-0.54px",
  },
  headingSmActive: {
    fontFamily: fontFamily.mono,
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21.6px",
    letterSpacing: "-0.54px",
  },
  body: {
    fontFamily: fontFamily.sans,
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "21px",
    letterSpacing: "-0.075px",
  },
  label: {
    fontFamily: fontFamily.sans,
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "16.8px",
    letterSpacing: "-0.12px",
  },
  uiBold: {
    fontFamily: fontFamily.sans,
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "19.6px",
    letterSpacing: "-0.35px",
  },
  logotypeDesktop: {
    fontFamily: fontFamily.logotype,
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36px",
    letterSpacing: "-1.5px",
  },
  logotypeMobile: {
    fontFamily: fontFamily.logotype,
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36px",
    letterSpacing: "-2.4px",
  },
} as const;
