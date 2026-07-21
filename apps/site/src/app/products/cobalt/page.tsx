import {
  Features,
  type FeatureSlide,
  CobaltMark,
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
    label: "UNIFIED MULTI-HAZARD FUSION",
    description:
      "Replaces multiple disconnected feeds with a single, live tactical map covering environmental, seismic, marine, and infrastructure risks.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "PROACTIVE MISSION CONTROL",
    description:
      "Go from passive monitoring to active coordination with regional AOR views, satellite/radar overlays, and live response dashboards.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "EARLY-WARNING DETECTION",
    description:
      "Ingest real-time alert layers to catch escalating threats and coordinate responses before they impact operations.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-common-operating-picture",
    heading: "UNIFIED COMMON OPERATING PICTURE",
    subheading: "From raw data feeds to active mission intelligence.",
    body: (
      <>
        <strong className="font-bold">Live Multi-Hazard Asset Mapping</strong>{" "}
        Instantly overlay your global personnel, facilities, and supply
        routes onto a single tactical map. Cobalt fuses real-time weather,
        seismic, volcanic, and marine data directly over your proprietary
        infrastructure layout—eliminating the need to manually
        cross-reference disconnected hazard maps during a crisis.
      </>
    ),
    imageSrc: "/products/cobalt-pdp-feature-1.png",
    imageAlt: "Cobalt unified operating picture",
  },
  {
    id: "proactive-threat-mitigation",
    heading: "PROACTIVE THREAT MITIGATION",
    subheading: "From watching a storm to predicting its tactical impact.",
    body: "Go beyond basic threshold alerts. Cobalt automatically calculates projected impact corridors along your key areas of responsibility (AORs). The platform triggers early warning notifications only when evolving conditions directly threaten an active mission or physical asset, filtering out noise so operators focus on true risks.",
    imageSrc: "/products/cobalt-pdp-feature-2.png",
    imageAlt: "Cobalt proactive threat mitigation",
  },
  {
    id: "accelerated-command-decisions",
    heading: "ACCELERATED COMMAND DECISIONS",
    subheading:
      "From chaotic communication to streamlined go/no-go coordination.",
    body: "Speed up decision loops when minutes matter. Cobalt generates live, shareable tactical dashboards and event timelines that sync in real time across field personnel, operations centers, and executive leadership. Coordinate posture adjustments, evacuations, and resource staging with complete situational alignment.",
    imageSrc: "/products/cobalt-pdp-feature-1.png",
    imageAlt: "Cobalt accelerated command decisions",
  },
];

export default function CobaltPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="COBALT"
          description="The weather intelligence command center for high-tempo operational planning, risk awareness, and mission timing."
          Mark={CobaltMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="One map for every hazard that can stop a mission"
                description="Unlike fragmented monitoring tools, Cobalt fuses real-time global risk data—weather, seismic, volcanic, marine, and infrastructure—into a single tactical map to accelerate early detection and response."
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
                name="COBALT"
                tagline="Predictable budgeting with zero seat-licensing friction."
                price="$500"
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
