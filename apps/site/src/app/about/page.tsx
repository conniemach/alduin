import { CobaltMark, BoreasMark, NightwatchMark, SplitFlapText } from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { ProductMarkLink } from "@/components/about/ProductMarkLink";
import { AnimatedLogoMark } from "@/components/about/AnimatedLogoMark";
import { ProblemPhilosophy } from "@/components/about/ProblemPhilosophy";
import { RoleTicker } from "@/components/about/RoleTicker";

// Every section headline is the same shape (short mono label, sized to
// match the treatment used everywhere else on the site—BenefitsSection,
// ProductBenefits, CenteredCta) so the page reads as one consistent
// system rather than a different layout invented per section.
function SectionHeadline({ children }: { children: string }) {
  return (
    <p className="font-mono text-[32px] leading-[38.4px] text-white">
      {children}
    </p>
  );
}

const FOUNDING_DOMAINS = [
  "CORPORATE SECURITY",
  "PROTECTIVE INTELLIGENCE",
  "CRISIS MANAGEMENT",
  "GLOBAL OPERATIONS",
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
  // Cypher is hidden for now — see GlobalNav.tsx.
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
              <h1 className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]">
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
          <div className="hidden flex-1 items-center justify-center self-stretch min-[901px]:flex">
            <AnimatedLogoMark />
          </div>
        </section>

        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <section className="flex flex-col gap-10 pb-24 pt-20">
              <SectionHeadline>Who we are</SectionHeadline>
              <p className="max-w-[720px] font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
                Alduin was founded by security and intelligence
                professionals who spent years working in private and
                public sector operations centers—supporting corporate
                security, protective intelligence, crisis management, and
                global operations.
              </p>
              <div className="flex flex-wrap gap-3">
                {FOUNDING_DOMAINS.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full border border-white/15 px-4 py-2 font-mono text-[13px] tracking-[0.04em] text-neutral-300 transition-colors duration-300 ease-out hover:border-white/40 hover:text-white"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="flex flex-col gap-10 pb-24 pt-20">
              <ProblemPhilosophy />
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="flex flex-col gap-10 pb-24 pt-20">
              <SectionHeadline>
                Built for the way operators work
              </SectionHeadline>
              <p className="max-w-[760px] font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
                Every product is designed around the way intelligence
                analysts, GSOC operators, investigators, emergency
                managers, and security professionals actually work.
                Whether monitoring severe weather, tracking geopolitical
                developments, managing investigations, producing
                intelligence briefings, or coordinating crisis response,
                the objective is the same: deliver the right information
                at the right time, in a format that supports confident
                decision-making.
              </p>

              <RoleTicker />

              <div className="flex flex-col gap-8 pt-6">
                <span className="font-mono text-[12px] tracking-[0.08em] text-neutral-500">
                  ACROSS THE PLATFORM
                </span>
                <div className="grid grid-cols-3 gap-5">
                  {PRODUCTS.map((product) => (
                    <ProductMarkLink key={product.slug} {...product} />
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="flex flex-col items-center gap-10 pb-16 pt-24 text-center">
              <p className="max-w-[600px] font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
                Alduin is built by operators, for operators—guided by the
                same principle that inspired the company in the first
                place.
              </p>
              <SplitFlapText
                text="SIGNAL OVER NOISE"
                className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[36px] lg:text-[42px]"
              />
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
