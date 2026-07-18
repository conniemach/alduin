import type { Meta, StoryObj } from "@storybook/react";
import { NavigationMobile } from "./NavigationMobile";

const meta: Meta<typeof NavigationMobile> = {
  title: "Components/NavigationMobile",
  component: NavigationMobile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Tap the menu icon to open/close the panel.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMobile>;

export const Default: Story = {
  render: () => (
    <div className="w-[375px] border border-white/10">
      <NavigationMobile />
    </div>
  ),
};
