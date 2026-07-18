import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardTitle, CardDescription } from "./Card";
import { Button } from "./Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardTitle>Card title</CardTitle>
      <CardDescription>
        A short description that explains what this card is for.
      </CardDescription>
      <Button className="mt-4" size="sm">
        Action
      </Button>
    </Card>
  ),
};
