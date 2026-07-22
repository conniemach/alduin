import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DemoForm } from "@/components/DemoForm";

export default function RequestADemoPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <section className="relative flex flex-col gap-10 overflow-hidden bg-black px-[70px] pb-20 pt-[100px] min-[1441px]:px-[150px] min-[901px]:flex-row min-[901px]:items-start min-[901px]:gap-[64px] min-[901px]:pt-[160px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 60% at 75% 35%, rgba(39, 39, 39, 0.8), rgba(0, 0, 0, 0) 70%)",
            }}
          />
          <div className="relative flex flex-1 flex-col gap-5">
            <h1 className="font-display text-[80px] leading-[104px] text-white">
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
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
}
