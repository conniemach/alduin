import { ButtonLinkout } from "@alduin/design-system";

export function CenteredCta() {
  return (
    <section className="mt-10 flex flex-col items-center gap-10 rounded-[40px] bg-neutral-850 px-[300px] py-[120px] text-center">
      <p className="font-mono text-[32px] leading-[38.4px] text-white">
        Connect with us
      </p>
      <p className="max-w-[540px] font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
        Schedule a quick call to learn how Area can turn your regional data
        into a powerful advantage.
      </p>
      <ButtonLinkout>Contact Us</ButtonLinkout>
    </section>
  );
}
