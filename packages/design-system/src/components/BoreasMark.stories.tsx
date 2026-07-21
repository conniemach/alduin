import type { Meta, StoryObj } from "@storybook/react";
import { BoreasMark } from "./BoreasMark";

const meta: Meta<typeof BoreasMark> = {
  title: "Components/BoreasMark",
  component: BoreasMark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BoreasMark>;

export const Default: Story = {};
