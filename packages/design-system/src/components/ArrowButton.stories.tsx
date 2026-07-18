import type { Meta, StoryObj } from "@storybook/react";
import { ArrowButton } from "./ArrowButton";

const meta: Meta<typeof ArrowButton> = {
  title: "Components/ArrowButton",
  component: ArrowButton,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["left", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof ArrowButton>;

export const Left: Story = { args: { direction: "left" } };
export const Right: Story = { args: { direction: "right" } };
export const Pair: Story = {
  render: () => (
    <div className="flex gap-2">
      <ArrowButton direction="left" />
      <ArrowButton direction="right" />
    </div>
  ),
};
