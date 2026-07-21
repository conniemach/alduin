import {
  Features,
  type FeatureSlide,
  BoreasMark,
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
    label: "UNIFIED TRAVELER VISIBILITY",
    description:
      "Replaces fragmented travel logs with one coordinated view of personnel movement, hotel geolocation, and live aircraft tracking across dynamic global itineraries.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "PROACTIVE EXPOSURE CROSS-CHECKS",
    description:
      "Go from static duty-of-care checklists to automated exposure cross-checks against geopolitical, environmental, and operational risk events as conditions change.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "ACCELERATED INTERVENTION RESPONSE",
    description:
      "Ingest real-time threat conditions to validate traveler safety posture quickly and coordinate interventions across regional and corporate stakeholders before exposure becomes incident.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-traveler-risk-picture",
    heading: "UNIFIED TRAVELER RISK PICTURE",
    subheading: "From fragmented travel logs to one coordinated view.",
    body: (
      <>
        <strong className="font-bold">Live Traveler Exposure Mapping</strong>{" "}
        Instantly overlay live aircraft movement, hotel geolocation, and
        personnel routing against real-time threat conditions. Boreas gives
        corporate security and GSOC teams one coordinated view of movement
        and risk proximity across volatile routes, airports, and destination
        clusters.
      </>
    ),
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas unified traveler risk picture",
  },
  {
    id: "proactive-exposure-cross-checks",
    heading: "PROACTIVE EXPOSURE CROSS-CHECKS",
    subheading: "From manual duty-of-care checks to automated cross-checks.",
    body: "Go beyond periodic safety reviews. Boreas continuously cross-checks traveler exposure against geopolitical, environmental, and operational risk events, reducing blind spots in high-risk movement windows. Travel risk teams maintain continuous duty-of-care awareness without re-validating posture by hand.",
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas proactive exposure cross-checks",
  },
  {
    id: "accelerated-intervention-response",
    heading: "ACCELERATED INTERVENTION RESPONSE",
    subheading: "From delayed outreach to enterprise-scale response.",
    body: "Speed up intervention when exposure turns into incident. Boreas helps teams validate traveler safety posture quickly and coordinate interventions across regional and corporate stakeholders, strengthening duty-of-care execution at enterprise scale.",
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas accelerated intervention response",
  },
];

export default function BoreasPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="BOREAS"
          description="Command-grade visibility into every traveler, route, and risk signal—before exposure becomes incident."
          Mark={BoreasMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="See every traveler's exposure before it becomes an incident"
                description="Aircraft movement, hotel geolocation, and shifting threat conditions rarely line up in one place. Boreas puts them on the same map, so security teams spot exposure while it's still building—not after it becomes an incident."
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
                name="BOREAS"
                tagline="Predictable budgeting with zero seat-licensing friction."
                price="$450"
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
