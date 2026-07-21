import {
  Features,
  type FeatureSlide,
  CypherMark,
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
    label: "UNIFIED CASE-FILE CONTROL",
    description:
      "Replace disconnected spreadsheets and shared drives with a single, structured system of record for every active investigation.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "GEOSPATIAL TARGETING",
    description:
      "Plot persons of interest, incidents, and evidence on a live map to reveal patterns and connections across cases.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "STRUCTURED CASE COORDINATION",
    description:
      "Assign tasks, track leads, and coordinate across investigators with a clear chain of custody.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-case-intelligence-picture",
    heading: "UNIFIED CASE INTELLIGENCE PICTURE",
    subheading: "From scattered case files to one structured workspace.",
    body: (
      <>
        <strong className="font-bold">Live Person-of-Interest Mapping</strong>{" "}
        Instantly overlay subjects, incidents, and evidence onto a single
        geospatial case view. Cypher fuses structured case data directly
        over your investigation timeline—eliminating the need to manually
        cross-reference disconnected files during active cases.
      </>
    ),
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher unified case intelligence picture",
  },
  {
    id: "proactive-lead-prioritization",
    heading: "PROACTIVE LEAD PRIORITIZATION",
    subheading: "From manual triage to automatic prioritization.",
    body: "Go beyond static case queues. Cypher automatically surfaces high-priority leads based on evidence strength, geospatial proximity, and case urgency, so investigators focus on what matters first.",
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher proactive lead prioritization",
  },
  {
    id: "accelerated-case-collaboration",
    heading: "ACCELERATED CASE COLLABORATION",
    subheading: "From isolated files to synchronized teams.",
    body: "Speed up investigations when time matters. Cypher generates live, shareable case dashboards and timelines that sync in real time across investigators, supervisors, and legal counsel.",
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher accelerated case collaboration",
  },
];

export default function CypherPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="CYPHER"
          description="A case management and person-of-interest investigation tool for structured investigations, case-file control, and geospatial targeting."
          Mark={CypherMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="The ultimate single-pane-of-glass investigation workspace"
                description="Unlike scattered spreadsheets and disconnected case files, Cypher fuses person-of-interest records, evidence, and geospatial data into a single structured investigation workspace."
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
                name="CYPHER"
                tagline="Predictable budgeting with zero seat-licensing friction."
                price="$600"
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
