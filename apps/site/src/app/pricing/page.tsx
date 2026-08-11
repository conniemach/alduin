import {
  CobaltMark,
  BoreasMark,
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
  // Cypher is hidden for now — see GlobalNav.tsx.
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
        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            {/* Hero: heading + included list, full width now that the
                product grid sits in its own row below rather than beside
                it. The included list runs horizontally once there's a
                full-width row to spread across, and stacks on mobile. */}
            <section className="flex flex-col gap-10 pb-16 pt-20">
              <div className="flex flex-col gap-6">
                <p className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]">
                  Three products. One predictable bill.
                </p>
                <div className="flex flex-col gap-3 min-[901px]:flex-row min-[901px]:gap-8">
                  {INCLUDED.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white"
                    >
                      <Icon name="check" className="size-4 text-white" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
