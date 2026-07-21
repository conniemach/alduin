import { ButtonLinkout } from "@alduin/design-system";

const DEFAULT_CLASSNAME =
  "mt-[100px] flex flex-col items-center gap-10 rounded-[40px] bg-neutral-850 px-[300px] py-[120px] text-center";

export interface CenteredCtaProps {
  /**
   * Full replacement for the section's classes, not a merge — callers
   * needing a different container size (e.g. a narrower column) pass
   * their own complete set rather than fighting Tailwind's utility
   * override-order rules on things like px-[300px]/mt-[100px].
   */
  className?: string;
}

export function CenteredCta({ className = DEFAULT_CLASSNAME }: CenteredCtaProps) {
  return (
    <section className={className}>
      {/* Grouped so a caller can swap the outer gap for justify-between
          (bottom-anchoring the button) without pulling the headline away
          from its own paragraph — see ProductPricing's identical trick. */}
      <div className="flex flex-col items-center gap-10">
        <p className="font-mono text-[32px] leading-[38.4px] text-white">
          Connect with Alduin
        </p>
        <p className="max-w-[540px] font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
          Schedule a quick call to learn how Alduin brings clarity,
          resilience, and command-grade visibility to teams operating in
          high-stakes environments.
        </p>
      </div>
      <ButtonLinkout>Contact Us</ButtonLinkout>
    </section>
  );
}
