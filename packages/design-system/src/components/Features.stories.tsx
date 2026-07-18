import type { Meta, StoryObj } from "@storybook/react";
import { Features, type FeatureSlide } from "./Features";

const meta: Meta<typeof Features> = {
  title: "Components/Features",
  component: Features,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Auto-advances every 5s (Figma-specified). Click a dot to jump to a slide.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Features>;

const slides: FeatureSlide[] = [
  {
    id: "1",
    heading: "UNIFIED COMMON OPERATING PICTURE",
    subheading: "From raw data feeds to active mission intelligence.",
    body: "Live Multi-Hazard Asset Mapping Instantly overlay your global personnel, facilities, and supply routes onto a single tactical map. Cobalt fuses real-time weather, seismic, volcanic, and marine data directly over your proprietary infrastructure layout—eliminating the need to manually cross-reference disconnected hazard maps during a crisis.",
    imageSrc: "/features/feature-1.png",
    imageAlt: "Unified common operating picture",
  },
  {
    id: "2",
    heading: "PROACTIVE THREAT MITIGATION",
    subheading: "From watching a storm to predicting its tactical impact.",
    body: "Go beyond basic threshold alerts. Cobalt automatically calculates projected impact corridors along your key areas of responsibility (AORs). The platform triggers early warning notifications only when evolving conditions directly threaten an active mission or physical asset, filtering out noise so operators focus on true risks.",
    imageSrc: "/features/feature-2.png",
    imageAlt: "Proactive threat mitigation",
  },
  {
    id: "3",
    heading: "ACCELERATED COMMAND DECISIONS",
    subheading:
      "From chaotic communication to streamlined go/no-go coordination.",
    body: "Speed up decision loops when minutes matter. Cobalt generates live, shareable tactical dashboards and event timelines that sync in real time across field personnel, operations centers, and executive leadership. Coordinate posture adjustments, evacuations, and resource staging with complete situational alignment.",
    imageSrc: "/features/feature-3.png",
    imageAlt: "Accelerated command decisions",
  },
];

export const Default: Story = {
  args: { slides },
};
