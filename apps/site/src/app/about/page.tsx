import { SplitFlapText } from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { ProblemPhilosophy } from "@/components/about/ProblemPhilosophy";
import { FocusAreaGrid } from "@/components/about/FocusAreaGrid";

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

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <section className="relative mx-auto flex max-w-[1440px] items-start bg-black px-[70px] pb-20 pt-5 min-[1440px]:px-[150px]">
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
        </section>

        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            <section className="flex flex-col gap-10 pb-24 pt-20">
              <h2 className="font-mono text-[32px] leading-[38.4px] text-white">
                Forged in high-stakes ops centers, Alduin was founded by
                intelligence veterans to bring frontline experience
                directly to corporate security, crisis management, and
                global protection.
              </h2>
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
              </p>

              <FocusAreaGrid />
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
