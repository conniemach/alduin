import {
  Features,
  type FeatureSlide,
  NightwatchMark,
  EarthSpinIcon,
  ChartDrawIcon,
  AccountPulseIcon,
} from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { ProductHero } from "@/components/pdp/ProductHero";
import { ProductBenefits, type Benefit } from "@/components/pdp/ProductBenefits";
import { ProductPricing } from "@/components/pdp/ProductPricing";

const benefits: Benefit[] = [
  {
    Icon: EarthSpinIcon,
    label: "UNIFIED SOURCE AGGREGATION",
    description:
      "Replace dozens of manual news checks with a single feed pulling from trusted global sources and advisories.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "PRIORITIZED DAILY BRIEFS",
    description:
      "Automatically rank overnight developments by relevance to your operations, regions, and assets.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "COMMAND-READY DISTRIBUTION",
    description:
      "Generate and share a polished morning brief across leadership in minutes, not hours.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-overnight-intelligence-picture",
    heading: "UNIFIED OVERNIGHT INTELLIGENCE PICTURE",
    subheading: "From scattered news feeds to one command brief.",
    body: (
      <>
        <strong className="font-bold">Live Source Aggregation</strong>{" "}
        Instantly compile overnight developments from trusted open-source
        reporting, government advisories, and internal alerts into a
        single briefing. Nightwatch fuses global reporting directly over
        your organization's regions and assets—eliminating the need to
        manually scan dozens of sources each morning.
      </>
    ),
    imageSrc: "/products/nightwatch.png",
    imageAlt: "Nightwatch unified overnight intelligence picture",
  },
  {
    id: "proactive-relevance-ranking",
    heading: "PROACTIVE RELEVANCE RANKING",
    subheading: "From raw headlines to ranked priorities.",
    body: "Go beyond a flat news feed. Nightwatch automatically ranks overnight developments by relevance to your specific regions, assets, and operations, surfacing what leadership needs to see first.",
    imageSrc: "/products/nightwatch.png",
    imageAlt: "Nightwatch proactive relevance ranking",
  },
  {
    id: "accelerated-morning-distribution",
    heading: "ACCELERATED MORNING DISTRIBUTION",
    subheading: "From manual compilation to instant distribution.",
    body: "Speed up your morning battle rhythm. Nightwatch generates a polished, shareable command brief automatically, syncing across leadership, watch officers, and field teams before the first meeting starts.",
    imageSrc: "/products/nightwatch.png",
    imageAlt: "Nightwatch accelerated morning distribution",
  },
];

export default function NightwatchPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="NIGHTWATCH"
          description="A daily situation briefing engine that pulls from trusted sources to generate a command-ready morning brief."
          Mark={NightwatchMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="The ultimate single-pane-of-glass daily briefing engine"
                description="Unlike manual news scanning, Nightwatch fuses trusted open-source reporting, government advisories, and internal alerts into a single command-ready morning brief."
                benefits={benefits}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <Features slides={slides} className="mt-[60px]" />
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-[100px] grid grid-cols-2 gap-5">
              <ProductPricing
                name="NIGHTWATCH"
                tagline="Predictable budgeting with zero seat-licensing friction."
                price="$350"
                included={[
                  "All inclusive software access",
                  "No Variable Overage Fees",
                  "Core API Feeds Included",
                ]}
              />
              <CenteredCta className="flex min-h-[340px] flex-col items-center justify-between rounded-[40px] border border-white/10 bg-neutral-850/50 px-20 py-10 text-center backdrop-blur-xl" />
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
}
