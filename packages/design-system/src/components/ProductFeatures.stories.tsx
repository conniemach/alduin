import type { Meta, StoryObj } from "@storybook/react";
import { ProductFeatures, type ProductFeatureItem } from "./ProductFeatures";

const meta: Meta<typeof ProductFeatures> = {
  title: "Components/ProductFeatures",
  component: ProductFeatures,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductFeatures>;

const items: ProductFeatureItem[] = [
  {
    id: "cobalt",
    tabLabel: "COBALT",
    eyebrow: "COBALT",
    description:
      "The weather intelligence command center for high-tempo operational planning, risk awareness, and mission timing.",
    imageSrc: "/products/cobalt.png",
    imageAlt: "Cobalt product screenshot",
  },
  {
    id: "boreas",
    tabLabel: "BOREAS",
    eyebrow: "BOREAS",
    description:
      "A corporate travel intelligence tool that tracks live aircraft movement, hotel locations, and traveler exposure to geopolitical and weather risk events.",
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas product screenshot",
  },
  {
    id: "cypher",
    tabLabel: "CYPHER",
    eyebrow: "CYPHER",
    description:
      "A case management and person-of-interest investigation tool for structured investigations, case-file control, and geospatial targeting.",
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher product screenshot",
  },
  {
    id: "nightwatch",
    tabLabel: "NIGHTWATCH",
    eyebrow: "NIGHTWATCH",
    description:
      "A daily situation briefing engine that pulls from trusted sources to generate a command-ready morning brief.",
    imageSrc: "/products/nightwatch.png",
    imageAlt: "Nightwatch product screenshot",
  },
];

export const Default: Story = {
  args: { items },
};
