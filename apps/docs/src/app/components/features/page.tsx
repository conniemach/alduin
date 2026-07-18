import { Features, type FeatureSlide } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

const slides: FeatureSlide[] = [
  {
    id: "1",
    heading: "UNIFIED COMMON OPERATING PICTURE",
    subheading: "From raw data feeds to active mission intelligence.",
    body: "Live Multi-Hazard Asset Mapping Instantly overlay your global personnel, facilities, and supply routes onto a single tactical map.",
    imageSrc: "/features/feature-1.png",
    imageAlt: "Unified common operating picture",
  },
  {
    id: "2",
    heading: "PROACTIVE THREAT MITIGATION",
    subheading: "From watching a storm to predicting its tactical impact.",
    body: "Go beyond basic threshold alerts. Cobalt automatically calculates projected impact corridors along your key areas of responsibility.",
    imageSrc: "/features/feature-2.png",
    imageAlt: "Proactive threat mitigation",
  },
  {
    id: "3",
    heading: "ACCELERATED COMMAND DECISIONS",
    subheading:
      "From chaotic communication to streamlined go/no-go coordination.",
    body: "Speed up decision loops when minutes matter. Cobalt generates live, shareable tactical dashboards and event timelines.",
    imageSrc: "/features/feature-3.png",
    imageAlt: "Accelerated command decisions",
  },
];

export default function FeaturesPage() {
  return (
    <DocPage
      kicker="Component"
      title="Features"
      description="A self-driving carousel for general feature highlights — it advances on its own every 5 seconds (straight from Figma's own prototype timing), and clicking a dot jumps there directly and resets the timer."
      preview={
        <PreviewCard align="stretch">
          <Features slides={slides} />
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          Watch it
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          Leave the preview above alone for 5 seconds and it moves to the
          next slide on its own. Click a dot to jump directly.
        </p>
      </div>

      <DeveloperSection>
        <CodeBlock
          code={`import { Features } from "@alduin/design-system";

<Features
  slides={[
    {
      id: "1",
      heading: "UNIFIED COMMON OPERATING PICTURE",
      subheading: "From raw data feeds to active mission intelligence.",
      body: "...",
      imageSrc: "/features/feature-1.png",
      imageAlt: "...",
    },
    // ...
  ]}
/>`}
        />
        <PropsTable
          rows={[
            {
              name: "slides",
              type: "FeatureSlide[]",
              description: "id, heading, subheading, body, imageSrc, imageAlt per slide.",
            },
          ]}
        />
        <p className="font-sans text-[13px] leading-[20px] text-neutral-500">
          Note: Figma collages each slide&rsquo;s image from 3 overlapping
          screenshot fragments at fixed positions. That&rsquo;s simplified
          here to one flattened image per slide.
        </p>
      </DeveloperSection>
    </DocPage>
  );
}
