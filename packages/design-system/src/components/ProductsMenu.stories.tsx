import type { Meta, StoryObj } from "@storybook/react";
import { ProductsMenu } from "./ProductsMenu";

const meta: Meta<typeof ProductsMenu> = {
  title: "Components/ProductsMenu",
  component: ProductsMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Hover (or click) \"Products\" to open the dropdown.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductsMenu>;

export const Default: Story = {
  render: () => (
    <div className="pb-48">
      <ProductsMenu onSelect={(p) => console.log("selected", p)} />
    </div>
  ),
};
