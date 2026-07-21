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
    label: "UNIFIED CASE-FILE GOVERNANCE",
    description:
      "Replaces disconnected files and informal handoffs with a single governed case record that preserves chronology, ownership, and procedural integrity.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "GEOSPATIAL TARGETING PRECISION",
    description:
      "Go from static case notes to live geospatial targeting overlays, plotting persons of interest and evidence with the precision investigative outcomes and legal defensibility require.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "ACCELERATED TARGET DEVELOPMENT",
    description:
      "Ingest leads and evidence into one auditable chain of custody, so investigators spend less time reconciling process gaps and more time advancing actionable targets.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-case-intelligence-picture",
    heading: "UNIFIED CASE INTELLIGENCE PICTURE",
    subheading: "From scattered case files to one governed record.",
    body: (
      <>
        <strong className="font-bold">Live Person-of-Interest Mapping</strong>{" "}
        Instantly centralize investigative workflows, evidence context, and
        geospatial targeting into a single case record. Cypher preserves
        chronology, ownership, and procedural integrity for every complex
        case—eliminating the ownership gaps and lost context that come from
        working across disconnected files.
      </>
    ),
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher unified case intelligence picture",
  },
  {
    id: "proactive-chain-of-custody-control",
    heading: "PROACTIVE CHAIN-OF-CUSTODY CONTROL",
    subheading: "From informal handoffs to accountable case discipline.",
    body: "Go beyond ad hoc tracking. Cypher enforces chain-of-custody logic and timeline fidelity across every handoff, so investigators inherit a fully accountable case record instead of reconstructing history after the fact. The platform is built for environments where procedural integrity directly affects legal defensibility.",
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher proactive chain-of-custody control",
  },
  {
    id: "accelerated-target-development",
    heading: "ACCELERATED TARGET DEVELOPMENT",
    subheading: "From process gaps to faster, auditable progression.",
    body: "Speed up case resolution when target development can't wait. Cypher gives investigators, supervisors, and legal counsel a synchronized view of case status, evidence, and geospatial context—cutting the friction of reconciling process gaps so teams advance actionable leads with confidence in the record.",
    imageSrc: "/products/cypher.png",
    imageAlt: "Cypher accelerated target development",
  },
];

export default function CypherPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="CYPHER"
          description="Person-of-interest workflows, case files, and geospatial targeting, unified into one governed record built for legal defensibility."
          Mark={CypherMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="Investigations built to hold up under scrutiny"
                description="Case files break down when evidence, ownership, and chronology live in different systems. Cypher keeps everything in one governed record, so investigators can hand off cases without losing the thread—or the chain of custody."
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
