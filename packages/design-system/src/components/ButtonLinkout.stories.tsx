import type { Meta, StoryObj } from "@storybook/react";
import { ButtonLinkout } from "./ButtonLinkout";

const meta: Meta<typeof ButtonLinkout> = {
  title: "Components/ButtonLinkout",
  component: ButtonLinkout,
  tags: ["autodocs"],
  args: {
    children: "Learn More",
  },
};

export default meta;
type Story = StoryObj<typeof ButtonLinkout>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ForcedHover: Story = {
  args: { className: "!border-white" },
  name: "Hover (forced, for visual review)",
};
