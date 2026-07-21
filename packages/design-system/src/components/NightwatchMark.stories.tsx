import type { Meta, StoryObj } from "@storybook/react";
import { NightwatchMark } from "./NightwatchMark";

const meta: Meta<typeof NightwatchMark> = {
  title: "Components/NightwatchMark",
  component: NightwatchMark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NightwatchMark>;

export const Default: Story = {};
