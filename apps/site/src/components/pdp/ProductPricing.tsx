import { Button, Icon } from "@alduin/design-system";

export interface ProductPricingProps {
  name: string;
  tagline: string;
  price: string;
  included: string[];
}

export function ProductPricing({
  name,
  tagline,
  price,
  included,
}: ProductPricingProps) {
  return (
    <section
      className={[
        // justify-between (not a fixed gap) anchors the button to the
        // card's bottom edge, matching the paired CenteredCta variant:
        // since both cards share the same min-height, padding, and equal
        // grid row height, this keeps their tops AND their button
        // bottoms aligned regardless of how much content sits above each
        // button — a fixed gap can't do that when the two sides' content
        // differs in height.
        "flex min-h-[340px] flex-col items-center justify-between rounded-[40px] px-20 py-10",
        // Liquid glass, matching the treatment used for buttons/dropdown
        // elsewhere — Figma's own version (Cobalt) uses a diagonal
        // gradient rim (#666666 -> #000000 -> #666666); simplified to a
        // flat translucent rim since CSS borders can't follow a
        // border-radius with a gradient without a border-image hack.
        "border border-white/10 bg-neutral-850/50 backdrop-blur-xl",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-12">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[12px] leading-[16.8px] tracking-[-0.12px] text-neutral-500">
            {name}
          </span>
          <p className="font-sans text-[13px] leading-[18px] text-neutral-200">
            {tagline}
          </p>
          <p className="mt-4 font-mono text-white">
            <span className="text-[64px] leading-[1]">{price}</span>
            <span className="text-[24px] leading-[1] text-neutral-200">
              /month
            </span>
          </p>
        </div>
        <ul className="flex flex-col gap-8">
          {included.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-sans text-[14px] leading-[19.6px] text-white"
            >
              <Icon name="check" className="size-4 text-white" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Button>Get Started</Button>
    </section>
  );
}
