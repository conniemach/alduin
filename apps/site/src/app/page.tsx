import {
  Navigation,
  NavigationMobile,
  ProductsMenu,
  ProductFeatures,
  Features,
  TableItem,
  type ProductFeatureItem,
  type FeatureSlide,
} from "@alduin/design-system";

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

const featureSlides: FeatureSlide[] = [
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

const specs = [
  "Ultra-fast browsing",
  "Real-time sync",
  "Offline mode",
  "Team workspaces",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <div className="hidden md:block">
        <Navigation>
          <ProductsMenu />
        </Navigation>
      </div>
      <div className="md:hidden">
        <NavigationMobile />
      </div>

      <div className="mx-auto max-w-[1220px] px-10">
        <div className="py-20">
          <h1 className="font-display text-[56px] leading-[1.1] text-white md:text-[80px] md:leading-[104px]">
            Header
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-200">
            This page is assembled entirely from components in
            @alduin/design-system. Change a component there and this page
            updates live.
          </p>
        </div>

        <ProductFeatures items={productItems} />
        <Features slides={featureSlides} />

        <div className="grid grid-cols-1 border-l border-t border-neutral-100/[0.32] pb-20 sm:grid-cols-2">
          {specs.map((label) => (
            <TableItem key={label} label={label} />
          ))}
        </div>
      </div>
    </main>
  );
}
