import { ProductFeatures, type ProductFeatureItem } from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Hero } from "@/components/Hero";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CenteredCta } from "@/components/CenteredCta";
import { Footer } from "@/components/Footer";

const productItems: ProductFeatureItem[] = [
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

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <div className="mx-auto max-w-[1280px]">
        <GlobalNav />
        <Hero />
        <div className="flex flex-col px-[70px]">
          <BenefitsSection />
          <ProductFeatures items={productItems} />
          <CenteredCta />
        </div>
        <Footer />
      </div>
    </main>
  );
}
