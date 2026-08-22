import {
  Features,
  type FeatureSlide,
  NightwatchMark,
  EarthSpinIcon,
  ChartDrawIcon,
  AccountPulseIcon,
  NIGHTWATCH_CAMERA_STOPS,
} from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { ProductHero } from "@/components/pdp/ProductHero";
import { ProductBenefits, type Benefit } from "@/components/pdp/ProductBenefits";
import { ProductPricing } from "@/components/pdp/ProductPricing";
import { withBasePath } from "@/lib/base-path";

const benefits: Benefit[] = [
  {
    Icon: EarthSpinIcon,
    label: "UNIFIED SOURCE AGGREGATION",
    description:
      "Pulls in reporting from other news outlets and wire services and consolidates it into Nightwatch, replacing dozens of manual source checks with a single pipeline.",
    animationMs: 2200,
  },
  {
    Icon: AccountPulseIcon,
    label: "PERSONALIZED TOPIC INGESTION",
    description:
      "Choose which topics the AI ingests into the report, so every brief is scoped to what a given user or team actually needs to see.",
    animationMs: 680,
  },
  {
    Icon: ChartDrawIcon,
    label: "CONSOLIDATED DATA & EXPORT",
    description:
      "See every ingested source consolidated in one report, with a summary chart that breaks down the data at a glance—then export it for easy distribution.",
    animationMs: 850,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-overnight-intelligence-picture",
    heading: "UNIFIED OVERNIGHT INTELLIGENCE PICTURE",
    subheading: "From scattered outlets to one consolidated feed.",
    body: (
      <>
        <strong className="font-bold">Live Source Aggregation</strong>{" "}
        Nightwatch pulls in reporting from other news outlets and wire
        services and consolidates it into a single overnight briefing,
        reducing source-by-source noise while preserving the context
        decision-makers need—giving teams a repeatable pipeline that holds
        up across rotating shifts and changing source conditions.
      </>
    ),
    imageSrc: withBasePath("/products/nightwatch.png"),
    imageAlt: "News outlets and wire feeds streaming into a single Nightwatch brief",
  },
  {
    id: "personalized-topic-ingestion",
    heading: "PERSONALIZED TOPIC INGESTION",
    subheading: "From one-size-fits-all to a report tuned to you.",
    body: (
      <>
        <strong className="font-bold">Custom Topic Selection</strong>{" "}
        Users choose which topics the AI ingests—geopolitics, cyber,
        energy markets, and more—so Nightwatch only pulls in what's
        relevant. Every report is personalized to the reader's needs
        instead of forcing everyone through the same generic feed.
      </>
    ),
    imageSrc: withBasePath("/products/nightwatch.png"),
    imageAlt: "Topic toggles feeding only selected subjects into a personalized brief",
  },
  {
    id: "consolidated-data-and-export",
    heading: "CONSOLIDATED DATA & EXPORT",
    subheading: "From raw ingest to a report you can read and share.",
    body: "See the consolidated data directly inside Nightwatch, alongside a summarized chart that shows how the report breaks down at a glance. When it's ready, export the full report as a PDF for easy distribution across leadership, watch officers, and field teams.",
    imageSrc: withBasePath("/products/nightwatch.png"),
    imageAlt: "Consolidated report with a data distribution chart and PDF export control",
  },
];

export default function NightwatchPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="NIGHTWATCH"
          description="Every trusted source, consolidated into a personalized, command-ready brief before the first meeting starts."
          Mark={NightwatchMark}
        />
        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="The morning brief leadership actually reads first"
                description="Most teams start the day piecing together a dozen sources by hand. Nightwatch consolidates them overnight into topics you choose, so leadership opens one command-ready, exportable brief instead of a stack of raw reporting."
                benefits={benefits}
              />
            </div>
          </ScrollReveal>
          {/* No ScrollReveal here — its IntersectionObserver fade doesn't
              cooperate with a scroll-pinned/sticky panel (see Cobalt's
              own Features usage for the same reasoning). */}
          <Features
            slides={slides}
            zoomScene={{ stops: NIGHTWATCH_CAMERA_STOPS, mode: "nightwatch" }}
            className="mt-[60px]"
          />
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
