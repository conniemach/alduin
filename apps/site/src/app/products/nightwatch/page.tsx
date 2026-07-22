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
      "Replaces dozens of manual source checks with a single pipeline that ingests selected reporting and reduces briefing noise without losing decision-critical context.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "PROACTIVE SIGNAL RANKING",
    description:
      "Go from a flat stream of reporting to priority-ranked signals, automatically scored so leadership sees what matters most before tempo spikes.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "ACCELERATED MORNING DISTRIBUTION",
    description:
      "Ingest overnight developments to generate a command-ready brief at start of day, cutting the delays that come from manual morning synthesis.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-overnight-intelligence-picture",
    heading: "UNIFIED OVERNIGHT INTELLIGENCE PICTURE",
    subheading: "From scattered sources to one repeatable pipeline.",
    body: (
      <>
        <strong className="font-bold">Live Source Aggregation</strong>{" "}
        Instantly ingest selected reporting and consolidate it into a
        single overnight briefing. Nightwatch reduces source-by-source
        noise while preserving the context decision-makers need—giving
        teams a repeatable pipeline that holds up across rotating shifts
        and changing source conditions.
      </>
    ),
    imageSrc: "/products/nightwatch.png",
    imageAlt: "Nightwatch unified overnight intelligence picture",
  },
  {
    id: "proactive-signal-ranking",
    heading: "PROACTIVE SIGNAL RANKING",
    subheading: "From flat reporting to ranked, decision-ready signals.",
    body: "Go beyond raw headlines. Nightwatch automatically ranks priority signals so the same high-quality discipline holds regardless of who's on shift or how source conditions change. The platform surfaces what leadership needs before tempo spikes, without sacrificing analyst judgment.",
    imageSrc: "/products/nightwatch.png",
    imageAlt: "Nightwatch proactive signal ranking",
  },
  {
    id: "accelerated-morning-distribution",
    heading: "ACCELERATED MORNING DISTRIBUTION",
    subheading: "From manual synthesis to command-ready delivery.",
    body: "Speed up the start of day when leadership can't wait. Nightwatch generates a command-ready brief and syncs it in real time across leadership, watch officers, and field teams—improving decision tempo and closing the delays caused by manual morning synthesis.",
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
          description="Every trusted source, ranked and delivered as a command-ready brief before the first meeting starts."
          Mark={NightwatchMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="The morning brief leadership actually reads first"
                description="Most teams start the day piecing together a dozen sources by hand. Nightwatch does the ranking overnight, so leadership opens one command-ready brief instead of a stack of raw reporting."
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
                price="$40"
                included={[
                  "All inclusive software access",
                  "No Variable Overage Fees",
                  "Core API Feeds Included",
                ]}
              />
              <CenteredCta className="flex min-h-[304px] flex-col items-center justify-between rounded-[40px] border border-white/10 bg-neutral-850/50 px-10 py-10 text-center backdrop-blur-xl" />
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
