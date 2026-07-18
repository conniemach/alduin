import type { Meta, StoryObj } from "@storybook/react";
import { DropdownItem } from "./DropdownItem";

const meta: Meta<typeof DropdownItem> = {
  title: "Components/DropdownItem",
  component: DropdownItem,
  tags: ["autodocs"],
  args: { children: "Cobalt" },
};

export default meta;
type Story = StoryObj<typeof DropdownItem>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <div className="w-40 rounded-md bg-neutral-900 p-2">
      {["Cobalt", "Boreas", "Cypher", "Nightwatch"].map((label) => (
        <DropdownItem key={label}>{label}</DropdownItem>
      ))}
    </div>
  ),
};
