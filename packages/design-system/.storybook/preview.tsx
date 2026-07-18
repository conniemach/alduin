import type { Preview } from "@storybook/react";
import React from "react";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "alduin-dark",
      values: [{ name: "alduin-dark", value: "#1e1e1e" }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-neutral-900 p-10 font-sans text-white">
        <Story />
      </div>
    ),
  ],
};

export default preview;
