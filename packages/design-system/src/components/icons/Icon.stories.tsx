import type { Meta, StoryObj } from "@storybook/react";
import { Icon, type IconName } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Icon>;

const names: IconName[] = [
  "check",
  "close",
  "chart",
  "account",
  "earth",
  "paint",
  "arrow-up-right",
  "arrow-left",
  "arrow-right",
  "menu",
];

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 sm:grid-cols-6">
      {names.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} className="size-6 text-white" />
          <span className="font-sans text-[12px] text-neutral-500">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
