"use client";

import { useState } from "react";
import { SplitFlapText } from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { AboutHero } from "@/components/about/AboutHero";
import { ProblemSolutionScroll } from "@/components/about/ProblemSolutionScroll";
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
  const [problemSolutionProgress, setProblemSolutionProgress] = useState(0);

  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <AboutHero />

        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            <section className="flex flex-col gap-10 pb-0 pt-10">
              <h2 className="font-mono text-[32px] leading-[38.4px] text-white">
                Forged in high-stakes ops centers, Alduin was founded by
                intelligence veterans to bring frontline experience
                directly to corporate security, crisis management, and
                global protection.
              </h2>
            </section>
          </ScrollReveal>

          <section className="flex flex-col pb-8 pt-8">
            <ProblemSolutionScroll onProgressChange={setProblemSolutionProgress} />
          </section>

          {/* No ScrollReveal here — this section sits directly below the
              pinned Problem/Solution panel, still fully in view (not
              scrolled to) while that panel is mid-transition, so
              ScrollReveal's own IntersectionObserver hadn't fired yet
              and this just read as a big empty gap under "Our Solution".
              Tying opacity directly to the pinned panel's own scroll
              progress instead: partially visible the whole time it's
              pinned, full opacity only once "Our Solution" finishes. */}
          <section
            className="flex flex-col gap-10 pb-24 pt-0"
            style={{
              opacity: problemSolutionProgress >= 1 ? 1 : 0.4,
              transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
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

          {/* No ScrollReveal wrapper here, unlike the other sections —
              SplitFlapText already plays its own scroll-triggered flip
              (same as the homepage Hero's), and fading the section in
              on top of that flip washed it out: by the time the section
              reached full opacity, the letters had already landed. */}
          <section className="flex flex-col items-center gap-10 pb-14 pt-16 text-center">
            <p className="w-full font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
              Alduin is built by operators, for operators—guided by the
              same principle that inspired the company in the first
              place.
            </p>
            <SplitFlapText
              text="SIGNAL OVER NOISE"
              className="font-science-gothic text-[36px] leading-[1.1] text-white md:text-[56px] lg:text-[68px]"
            />
          </section>

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
