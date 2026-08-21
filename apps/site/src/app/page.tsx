"use client";

import { useRouter } from "next/navigation";
import { ProductFeatures, type ProductFeatureItem } from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Hero } from "@/components/Hero";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CenteredCta } from "@/components/CenteredCta";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  const router = useRouter();

  const productItems: ProductFeatureItem[] = [
    {
      id: "cobalt",
      tabLabel: "COBALT",
      eyebrow: "COBALT",
      description:
        "The weather intelligence command center for high-tempo operational planning, risk awareness, and mission timing.",
      scene: "cobalt",
      imageAlt: "Cobalt command map, showing fused weather, seismic, volcanic, marine, and infrastructure alerts",
      onLearnMore: () => router.push("/products/cobalt"),
    },
    // Boreas is hidden for now (not deleted — the PDP and design-system
    // pieces still exist) — see the ProductsMenu/pricing hides too.
    // {
    //   id: "boreas",
    //   tabLabel: "BOREAS",
    //   eyebrow: "BOREAS",
    //   description:
    //     "Command-grade visibility into every traveler, route, and risk signal—before exposure becomes incident.",
    //   scene: "boreas",
    //   imageAlt: "Boreas exposure map, showing live flight paths and traveler locations against threat zones",
    //   onLearnMore: () => router.push("/products/boreas"),
    // },
    // Cypher is hidden for now (not deleted — the PDP and design-system
    // pieces still exist) — see the ProductsMenu/pricing/about hides too.
    {
      id: "nightwatch",
      tabLabel: "NIGHTWATCH",
      eyebrow: "NIGHTWATCH",
      description:
        "Every trusted source, ranked and delivered as a command-ready brief before the first meeting starts.",
      scene: "nightwatch",
      imageAlt: "Nightwatch briefing pipeline, showing ranked sources flowing into a daily brief",
      onLearnMore: () => router.push("/products/nightwatch"),
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <Hero />
        <div className="mx-auto flex max-w-[1440px] flex-col px-[70px] min-[1440px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <BenefitsSection />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <ProductFeatures className="mt-[60px]" items={productItems} />
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
