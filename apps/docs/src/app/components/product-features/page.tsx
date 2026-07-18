import {
  ProductFeatures,
  type ProductFeatureItem,
} from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

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

export default function ProductFeaturesPage() {
  return (
    <DocPage
      kicker="Component"
      title="Product Features"
      description="A tabbed showcase for the product family — one shared headline, with the tab bar switching the eyebrow, description, link, and image below it. Purely click-driven; nothing auto-advances here."
      preview={
        <PreviewCard align="stretch">
          <ProductFeatures items={items} />
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          Try it
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          Click between COBALT, BOREAS, CYPHER, and NIGHTWATCH above — the
          description and image swap immediately.
        </p>
      </div>

      <DeveloperSection>
        <CodeBlock
          code={`import { ProductFeatures } from "@alduin/design-system";

<ProductFeatures
  headline="Deployable independently. Integrated for unified intelligence."
  items={[
    {
      id: "cobalt",
      tabLabel: "COBALT",
      eyebrow: "COBALT",
      description: "...",
      imageSrc: "/products/cobalt.png",
      imageAlt: "Cobalt product screenshot",
      onLearnMore: () => ...,
    },
    // ...
  ]}
/>`}
        />
        <PropsTable
          rows={[
            {
              name: "headline",
              type: "string",
              default: '"Deployable independently. Integrated for unified intelligence."',
              description: "Shared headline shown for every tab.",
            },
            {
              name: "items",
              type: "ProductFeatureItem[]",
              description: "One entry per tab — id, tabLabel, eyebrow, description, imageSrc, imageAlt, onLearnMore.",
            },
          ]}
        />
      </DeveloperSection>
    </DocPage>
  );
}
