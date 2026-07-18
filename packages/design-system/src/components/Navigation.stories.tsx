import type { Meta, StoryObj } from "@storybook/react";
import { Navigation } from "./Navigation";
import { ProductsMenu } from "./ProductsMenu";

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  render: () => (
    <div className="pb-48">
      <Navigation>
        <ProductsMenu />
      </Navigation>
    </div>
  ),
};
