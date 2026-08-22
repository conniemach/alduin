import {
  Features,
  type FeatureSlide,
  CobaltMark,
  EarthSpinIcon,
  ChartDrawIcon,
  AccountPulseIcon,
  DEFAULT_CAMERA_STOPS,
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
    label: "GLOBAL SITUATIONAL PICTURE",
    description:
      "See a realistic, live view of every active hazard across the globe—weather, seismic, volcanic, and marine—fused into a single map before drilling into what matters.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "REGIONAL DRILL-DOWN & LIVE FOOTAGE",
    description:
      "Zoom or click into any region or city to see exactly what's unfolding there, down to live footage from the ground.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "PHYSICS-BASED SIMULATION",
    description:
      "Run realistic physics and analytics simulations of unfolding events so teams can prepare and rehearse a response before it happens.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "global-situational-picture",
    heading: "GLOBAL SITUATIONAL PICTURE",
    subheading: "From scattered alerts to one realistic live map of the world.",
    body: (
      <>
        <strong className="font-bold">Live Global Coverage</strong>{" "}
        Cobalt fuses real-time weather, seismic, volcanic, and marine data
        into a single realistic map of everything happening across the
        globe right now—giving every team the same command-grade picture
        from the first glance, before they ever drill into a single
        region.
      </>
    ),
    imageSrc: withBasePath("/products/cobalt-pdp-feature-1.png"),
    imageAlt: "Realistic live map of active hazards across the globe",
  },
  {
    id: "regional-drill-down",
    heading: "REGIONAL DRILL-DOWN",
    subheading: "From the whole planet to the one block that matters.",
    body: (
      <>
        <strong className="font-bold">Zoom & Click Navigation</strong>{" "}
        Zoom into any region, or click directly onto a city or site, to
        see exactly which events are unfolding there—storms, seismic
        activity, volcanic movement, and more—without losing the global
        context you started from.
      </>
    ),
    imageSrc: withBasePath("/products/cobalt-pdp-feature-2.png"),
    imageAlt: "Zooming into a region to see local storm, seismic, and volcanic activity",
  },
  {
    id: "live-ground-footage",
    heading: "LIVE GROUND FOOTAGE",
    subheading: "From sensor data to eyes on the ground.",
    body: (
      <>
        <strong className="font-bold">Real-Time Camera Feeds</strong> See
        live footage from the regions you're monitoring so you can verify
        conditions on the ground in real time, instead of inferring them
        from sensor data alone.
      </>
    ),
    imageSrc: withBasePath("/products/cobalt-pdp-feature-1.png"),
    imageAlt: "Live ground camera feed from an active region",
  },
  {
    id: "physics-based-simulation",
    heading: "PHYSICS-BASED SIMULATION",
    subheading: "From raw data to a rehearsed response.",
    body: "Run real physics and analytics against live conditions to simulate how an event will actually unfold. Coordinate posture adjustments, evacuations, and resource staging against that simulation, so teams rehearse the response before they ever need it.",
    imageSrc: withBasePath("/products/cobalt-pdp-feature-2.png"),
    imageAlt: "Physics-based simulation of a storm's projected impact corridor",
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
        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="One map for every hazard that can stop a mission"
                description="Unlike fragmented monitoring tools, Cobalt fuses real-time global risk data—weather, seismic, volcanic, marine, and infrastructure—into one realistic map, then lets you zoom into ground-level footage and simulate how an event will actually unfold."
                benefits={benefits}
              />
            </div>
          </ScrollReveal>
          {/* No ScrollReveal here — its IntersectionObserver fade doesn't
              cooperate with a scroll-pinned/sticky panel, same reason
              the About page doesn't wrap ProblemSolutionScroll in one. */}
          <Features
            slides={slides}
            zoomScene={{ stops: DEFAULT_CAMERA_STOPS }}
            className="mt-[60px]"
          />
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
