import type { Meta, StoryObj } from "@storybook/react";
import { CypherMark } from "./CypherMark";

const meta: Meta<typeof CypherMark> = {
  title: "Components/CypherMark",
  component: CypherMark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CypherMark>;

export const Default: Story = {};
