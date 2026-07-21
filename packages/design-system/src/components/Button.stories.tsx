import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Learn More",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ForcedHover: Story = {
  args: {
    className:
      "[&_[data-slot=hover-layer]]:!opacity-100 [&_[data-slot=label]]:!text-neutral-100",
  },
  name: "Hover (forced, for visual review)",
};
