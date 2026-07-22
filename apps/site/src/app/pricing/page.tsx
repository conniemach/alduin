import {
  CobaltMark,
  BoreasMark,
  CypherMark,
  NightwatchMark,
  Icon,
} from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { PricingCard, type PricingCardProps } from "@/components/pricing/PricingCard";

// Same three lines as each product's own PDP pricing card (see
// ProductPricing usage in app/products/*/page.tsx) — kept verbatim since
// it's the one piece of pricing copy that has to match exactly wherever
// a price appears. Shown once above the grid rather than per-card since
// it's identical for every product.
const INCLUDED = [
  "All inclusive software access",
  "No Variable Overage Fees",
  "Core API Feeds Included",
];

const PRODUCTS: PricingCardProps[] = [
  {
    slug: "cobalt",
    name: "COBALT",
    description:
      "A weather intelligence command center for high-tempo planning, risk awareness, and mission timing.",
    price: "$500",
    Mark: CobaltMark,
  },
  {
    slug: "boreas",
    name: "BOREAS",
    description:
      "Command-grade visibility into each traveler, route, and risk signal before it becomes an incident.",
    price: "$2,000",
    Mark: BoreasMark,
  },
  {
    slug: "cypher",
    name: "CYPHER",
    description:
      "Person-of-interest workflows and case files, unified into one governed, legally defensible record.",
    price: "$3,500",
    Mark: CypherMark,
  },
  {
    slug: "nightwatch",
    name: "NIGHTWATCH",
    description:
      "All trusted sources ranked and delivered as a command-ready brief before the first meeting starts.",
    price: "$40",
    Mark: NightwatchMark,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <section className="flex flex-col gap-[50px] pb-20 pt-20">
              <div className="flex w-full flex-col gap-4">
                <p className="font-mono text-[32px] leading-[38.4px] text-white">
                  Four products. One predictable bill.
                </p>
                <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
                  Every plan below includes full software access, every
                  core API feed, and a fixed monthly rate—no metered
                  usage to track and no surprise invoices at the end of
                  the month.
                </p>
              </div>

              <div className="flex items-center justify-between">
                {INCLUDED.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-white"
                  >
                    <Icon name="check" className="size-4 text-white" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20" />

              <div className="grid grid-cols-4 gap-5">
                {PRODUCTS.map((product) => (
                  <PricingCard key={product.slug} {...product} />
                ))}
              </div>
            </section>
          </ScrollReveal>
          <ScrollReveal>
            <CenteredCta />
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
}
