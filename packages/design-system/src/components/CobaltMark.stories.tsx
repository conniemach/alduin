import type { Meta, StoryObj } from "@storybook/react";
import { CobaltMark } from "./CobaltMark";

const meta: Meta<typeof CobaltMark> = {
  title: "Components/CobaltMark",
  component: CobaltMark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CobaltMark>;

export const Default: Story = {};
