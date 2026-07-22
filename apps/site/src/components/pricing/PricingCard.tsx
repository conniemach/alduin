"use client";

import { useRouter } from "next/navigation";
import type { ComponentType } from "react";

export interface PricingCardProps {
  slug: string;
  name: string;
  description: string;
  price: string;
  Mark: ComponentType;
}

// Every ProductMark is a fixed 280x280 scene (see product-mark.css); the
// wrapper below scales it down and clips the overflow rather than
// resizing it directly, same technique ProductHero uses to blow one up.
const MARK_SCALE = 0.32;
const MARK_BOX_PX = 280 * MARK_SCALE;

export function PricingCard({
  slug,
  name,
  description,
  price,
  Mark,
}: PricingCardProps) {
  const router = useRouter();

  return (
    <div
      className={[
        "mark-hover-only group flex flex-col gap-6 rounded-[40px] px-9 py-10",
        // Same liquid-glass treatment as ProductPricing/CenteredCta so
        // this reads as the same design system, not a bespoke card.
        "border border-white/10 bg-neutral-850/50 backdrop-blur-xl",
        // A faint top-edge sheen that only shows once the border itself
        // has brightened on hover — reads as the glass catching a bit of
        // light, a quiet "this one's selected" cue rather than a loud
        // highlight. The lift itself runs on its own, much slower timing
        // (see the inline transition below) so it floats up rather than
        // snapping, while the border/shadow keep their own snappier feel.
        "hover:-translate-y-2 hover:border-white/25",
        "hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_40px_-20px_rgba(0,0,0,0.6)]",
      ].join(" ")}
      style={{
        // Tailwind v4 emits translate-y utilities as the standalone CSS
        // `translate` property, not `transform` — transitioning
        // `transform` here was a no-op, which is why the lift snapped
        // instantly regardless of this duration.
        transition:
          "border-color 300ms ease-out, box-shadow 300ms ease-out, translate 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <button
        type="button"
        onClick={() => router.push(`/products/${slug}`)}
        aria-label={`View ${name} product page`}
        className="flex flex-col items-start gap-4 text-left"
      >
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden"
          style={{ width: MARK_BOX_PX, height: MARK_BOX_PX }}
        >
          <div style={{ transform: `scale(${MARK_SCALE})` }}>
            <Mark />
          </div>
        </div>
        <span className="font-display text-[28px] leading-[1] text-white transition-colors duration-300 group-hover:text-neutral-200">
          {name}
        </span>
      </button>
      <p className="font-sans text-[14px] leading-[19.6px] text-neutral-200">
        {description}
      </p>
      <p className="font-mono text-white">
        <span className="text-[40px] leading-[1]">{price}</span>
        <span className="text-[16px] leading-[1] text-neutral-200">
          /month
        </span>
      </p>
    </div>
  );
}
