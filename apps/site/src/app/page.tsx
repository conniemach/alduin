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
      imageSrc: "/products/cobalt.png",
      imageAlt: "Cobalt product screenshot",
      onLearnMore: () => router.push("/products/cobalt"),
    },
    {
      id: "boreas",
      tabLabel: "BOREAS",
      eyebrow: "BOREAS",
      description:
        "Command-grade visibility into every traveler, route, and risk signal—before exposure becomes incident.",
      imageSrc: "/products/boreas.png",
      imageAlt: "Boreas product screenshot",
      onLearnMore: () => router.push("/products/boreas"),
    },
    {
      id: "cypher",
      tabLabel: "CYPHER",
      eyebrow: "CYPHER",
      description:
        "Person-of-interest workflows, case files, and geospatial targeting, unified into one governed record built for legal defensibility.",
      imageSrc: "/products/cypher.png",
      imageAlt: "Cypher product screenshot",
      onLearnMore: () => router.push("/products/cypher"),
    },
    {
      id: "nightwatch",
      tabLabel: "NIGHTWATCH",
      eyebrow: "NIGHTWATCH",
      description:
        "Every trusted source, ranked and delivered as a command-ready brief before the first meeting starts.",
      imageSrc: "/products/nightwatch.png",
      mobileImageSrc: "/products/nightwatch-mobile.png",
      imageAlt: "Nightwatch product screenshot",
      onLearnMore: () => router.push("/products/nightwatch"),
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <Hero />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
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
