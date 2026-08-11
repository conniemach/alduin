import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DemoForm } from "@/components/DemoForm";

export default function RequestADemoPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ScrollReveal>
          <section className="relative mx-auto flex max-w-[1440px] flex-col gap-10 overflow-hidden bg-black px-[70px] pb-20 pt-[80px] min-[1440px]:px-[150px] min-[901px]:flex-row min-[901px]:items-start min-[901px]:gap-[64px] min-[901px]:pt-[140px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(60% 60% at 75% 35%, rgba(39, 39, 39, 0.8), rgba(0, 0, 0, 0) 70%)",
              }}
            />
            <div className="relative flex flex-1 flex-col gap-5">
              <h1 className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]">
                Secure What Matters Most
              </h1>
              <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
                Connect with our team to explore our suite of enterprise
                platforms, initiate public sector procurement, or establish a
                strategic partnership.
              </p>
            </div>
            <div className="relative flex-1">
              <DemoForm />
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
}
