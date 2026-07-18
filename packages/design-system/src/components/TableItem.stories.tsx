import type { Meta, StoryObj } from "@storybook/react";
import { TableItem } from "./TableItem";

const meta: Meta<typeof TableItem> = {
  title: "Components/TableItem",
  component: TableItem,
  tags: ["autodocs"],
  args: { label: "Ultra-fast browsing" },
};

export default meta;
type Story = StoryObj<typeof TableItem>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72 border-t border-r border-neutral-100/[0.32]">
      <TableItem {...args} />
    </div>
  ),
};

export const Grid: Story = {
  render: () => {
    const labels = [
      "Ultra-fast browsing",
      "Real-time sync",
      "Offline mode",
      "Team workspaces",
    ];
    return (
      <div className="grid w-[560px] grid-cols-2 border-t border-r border-neutral-100/[0.32]">
        {labels.map((label) => (
          <TableItem key={label} label={label} />
        ))}
      </div>
    );
  },
};
