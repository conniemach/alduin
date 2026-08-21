"use client";

import { useRouter } from "next/navigation";
import type { ComponentType } from "react";

export interface PricingCardProps {
  slug: string;
  name: string;
  description: string;
  Mark: ComponentType;
}

// Every ProductMark is a fixed 280x280 scene (see product-mark.css); the
// wrapper below scales it down and clips the overflow rather than
// resizing it directly, same technique ProductHero uses to blow one up.
// Sized for a 2-up grid across the full page width — every size below
// (mark, name, description, price) scales together at roughly the same
// ratio so the card still reads as the same design, just denser, rather
// than one piece growing or shrinking out of proportion with the rest.
const MARK_SCALE = 0.35;
const MARK_BOX_PX = 280 * MARK_SCALE;

export function PricingCard({
  slug,
  name,
  description,
  Mark,
}: PricingCardProps) {
  const router = useRouter();

  return (
    <div
      // No card shell (border/background/blur) — this sits directly on
      // the page next to its ComparisonTable so the pair reads as one
      // plain section rather than two boxes. Content is packed tight
      // (no justify-between) rather than spread across the row height.
      className="mark-hover-only group flex flex-col gap-3"
    >
      <button
        type="button"
        onClick={() => router.push(`/products/${slug}`)}
        aria-label={`View ${name} product page`}
        className="flex flex-col items-start gap-3 text-left"
      >
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden"
          style={{ width: MARK_BOX_PX, height: MARK_BOX_PX }}
        >
          <div style={{ transform: `scale(${MARK_SCALE})` }}>
            <Mark />
          </div>
        </div>
        <span className="font-logotype text-[38px] font-medium leading-[44px] tracking-[-1.9px] text-white transition-colors duration-300 group-hover:text-neutral-200">
          {name}
        </span>
      </button>
      <p className="font-sans text-[15px] leading-[21px] text-neutral-200">
        {description}
      </p>
    </div>
  );
}
