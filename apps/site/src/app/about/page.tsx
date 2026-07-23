import {
  CobaltMark,
  BoreasMark,
  CypherMark,
  NightwatchMark,
  EarthSpinIcon,
  ChartDrawIcon,
  AccountPulseIcon,
} from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { ProductMarkLink } from "@/components/about/ProductMarkLink";
import { TeamGrid, type TeamGridItem } from "@/components/about/TeamGrid";
import { SystemClock } from "@/components/about/SystemClock";

// Every section intro is the same shape (one-line headline, one-sentence
// description, stacked in a single narrow column) so the page reads as
// one consistent system rather than a different layout invented per
// section — sized to match the headline treatment used everywhere else
// on the site (BenefitsSection, ProductBenefits, CenteredCta).
function SectionIntro({
  headline,
  description,
}: {
  headline: string;
  description: string;
}) {
  return (
    <div className="flex max-w-[600px] flex-col gap-4">
      <p className="font-mono text-[32px] leading-[38.4px] text-white">
        {headline}
      </p>
      <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
        {description}
      </p>
    </div>
  );
}

const TEAM: TeamGridItem[] = [
  {
    Icon: EarthSpinIcon,
    label: "FIELD INTELLIGENCE",
    description:
      "Analysts and former operators who shape what “useful” actually means in the field, not just in a demo.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "PLATFORM ENGINEERING",
    description:
      "The team turning fragmented feeds and formats into one reliable, governed data layer.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "CUSTOMER OPERATIONS",
    description:
      "Hands-on onboarding and support from people who understand what's actually at stake in your queue.",
    animationMs: 680,
  },
];

const VALUES = [
  {
    label: "OPERATOR-LED",
    description:
      "Every workflow is shaped by people who've actually run the incident, worked the case, or briefed the principal—not guessed at it from a whiteboard.",
  },
  {
    label: "SIGNAL OVER NOISE",
    description:
      "We'd rather ship one feed that's actually trustworthy than ten that each say something slightly different. Less to reconcile, more to act on.",
  },
  {
    label: "BUILT TO BE TRUSTED",
    description:
      "Chain of custody, audit trails, and governed records aren't an afterthought—they're what makes a decision defensible after the fact.",
  },
];

const PRODUCTS = [
  {
    slug: "cobalt",
    name: "COBALT",
    description:
      "The weather intelligence command center for high-tempo operational planning, risk awareness, and mission timing.",
    Mark: CobaltMark,
  },
  {
    slug: "boreas",
    name: "BOREAS",
    description:
      "Command-grade visibility into every traveler, route, and risk signal—before exposure becomes incident.",
    Mark: BoreasMark,
  },
  {
    slug: "cypher",
    name: "CYPHER",
    description:
      "Person-of-interest workflows, case files, and geospatial targeting, unified into one governed record built for legal defensibility.",
    Mark: CypherMark,
  },
  {
    slug: "nightwatch",
    name: "NIGHTWATCH",
    description:
      "Every trusted source, ranked and delivered as a command-ready brief before the first meeting starts.",
    Mark: NightwatchMark,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <section className="relative flex items-start justify-between bg-black px-[70px] pb-20 pt-5 min-[1441px]:px-[150px]">
          <div className="flex flex-col gap-10 py-[110px]">
            <div className="flex max-w-[632px] flex-col gap-0">
              <h1 className="font-display text-[80px] leading-[104px] text-white">
                CLARITY UNDER PRESSURE
              </h1>
              <p className="mt-4 font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
                Alduin exists for the teams making high-stakes calls under
                fire, under deadline, under scrutiny—command centers,
                security desks, and investigators who can&rsquo;t afford to
                guess.
              </p>
            </div>
          </div>
          <div className="hidden pt-[110px] min-[901px]:block">
            <SystemClock />
          </div>
        </section>

        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <section className="flex flex-col gap-16 pb-24 pt-20">
              <SectionIntro
                headline="The team"
                description="Alduin is built by a small, cross-disciplinary group who've sat on both sides of the tools we ship—as operators and as engineers."
              />
              <TeamGrid items={TEAM} />
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="flex flex-col gap-16 pb-24 pt-20">
              <SectionIntro
                headline="What we believe"
                description="None of this works if the platform itself becomes one more thing to manage. These are the principles we hold ourselves to."
              />

              <div className="flex max-w-[760px] flex-col">
                {VALUES.map((v, i) => (
                  <div
                    key={v.label}
                    className="flex gap-8 border-t border-white/10 py-8 first:pt-0"
                  >
                    <span className="w-8 flex-none font-mono text-[14px] leading-[21px] text-neutral-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2">
                      <p className="font-mono text-[16px] leading-[19.2px] text-white">
                        {v.label}
                      </p>
                      <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-400">
                        {v.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="flex flex-col gap-16 pb-24 pt-20">
              <SectionIntro
                headline="Four products, one team."
                description="Cobalt, Boreas, Cypher, and Nightwatch each solve a specific operational problem, but they share the same data fabric and the same design language throughout."
              />

              <div className="grid grid-cols-4 gap-5">
                {PRODUCTS.map((product) => (
                  <ProductMarkLink key={product.slug} {...product} />
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
