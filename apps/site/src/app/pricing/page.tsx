import { CobaltMark, NightwatchMark } from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { PricingCard, type PricingCardProps } from "@/components/pricing/PricingCard";
import { ComparisonTable, type ComparisonRow } from "@/components/pricing/ComparisonTable";

// Placeholder until real competitor research lands — names and checks
// below are dummy data, just enough to show the comparison layout.
const COMPETITORS = ["Legacy Platform", "Typical SaaS"];

const PRODUCTS: (PricingCardProps & { comparison: ComparisonRow[] })[] = [
  {
    slug: "cobalt",
    name: "COBALT",
    description:
      "A weather intelligence command center for high-tempo planning, risk awareness, and mission timing.",
    Mark: CobaltMark,
    comparison: [
      {
        feature: "",
        productValue: "$500/month",
        competitorValues: ["$1,200/month", "Custom pricing"],
      },
      {
        feature: "Real-time hazard modeling",
        productValue: true,
        competitorValues: [false, false],
      },
      {
        feature: "Unlimited API calls",
        productValue: true,
        competitorValues: [false, true],
      },
      {
        feature: "No per-seat pricing",
        productValue: true,
        competitorValues: [false, false],
      },
      {
        feature: "24/7 command support",
        productValue: true,
        competitorValues: [true, false],
      },
    ],
  },
  // Boreas is hidden for now — see GlobalNav.tsx.
  // {
  //   slug: "boreas",
  //   name: "BOREAS",
  //   description:
  //     "Command-grade visibility into each traveler, route, and risk signal before it becomes an incident.",
  //   Mark: BoreasMark,
  //   comparison: [],
  // },
  // Cypher is hidden for now — see GlobalNav.tsx.
  {
    slug: "nightwatch",
    name: "NIGHTWATCH",
    description:
      "All trusted sources ranked and delivered as a command-ready brief before the first meeting starts.",
    Mark: NightwatchMark,
    comparison: [
      {
        feature: "",
        productValue: "$40/month",
        competitorValues: ["$99/month", "Custom pricing"],
      },
      {
        feature: "Daily command-ready brief",
        productValue: true,
        competitorValues: [false, false],
      },
      {
        feature: "Source ranking & trust scoring",
        productValue: true,
        competitorValues: [false, false],
      },
      {
        feature: "Unlimited saved sources",
        productValue: true,
        competitorValues: [false, true],
      },
      {
        feature: "No per-seat pricing",
        productValue: true,
        competitorValues: [true, false],
      },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            {/* Left-aligned like Secure What Matters Most on the demo page,
                rather than the old centered hero — this is a page heading,
                not a marketing banner, so it sits flush with the content
                below it. */}
            <section className="flex flex-col pb-16 pt-20">
              <h1 className="mb-[100px] font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]">
                Command-Grade Pricing
              </h1>
              {/* divide-y is the separator between products — a plain
                  border rather than a wrapping box, so each product +
                  its comparison table still reads as one section rather
                  than a card. */}
              <div className="flex flex-col divide-y divide-white/10">
                {PRODUCTS.map(({ comparison, ...product }) => (
                  <div
                    key={product.slug}
                    className="grid grid-cols-1 gap-10 py-24 first:pt-0 last:pb-0 min-[901px]:grid-cols-[35fr_65fr] min-[901px]:gap-16"
                  >
                    <PricingCard {...product} />
                    <ComparisonTable
                      productName={product.name}
                      competitors={COMPETITORS}
                      rows={comparison}
                    />
                  </div>
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
