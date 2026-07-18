import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tab } from "./Tab";

const meta: Meta<typeof Tab> = {
  title: "Components/Tab",
  component: Tab,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Inactive: Story = { args: { children: "COBALT" } };
export const Active: Story = { args: { children: "COBALT", active: true } };

export const Group: Story = {
  render: () => {
    const labels = ["COBALT", "BOREAS", "CYPHER", "NIGHTWATCH"];
    const [active, setActive] = useState(labels[0]);
    return (
      <div className="inline-flex items-center gap-3 rounded-full bg-neutral-850 px-4 py-2">
        {labels.map((label) => (
          <Tab
            key={label}
            active={active === label}
            onClick={() => setActive(label)}
          >
            {label}
          </Tab>
        ))}
      </div>
    );
  },
};
