"use client";

import { useRouter } from "next/navigation";
import type { ComponentType } from "react";

export interface ProductMarkLinkProps {
  slug: string;
  name: string;
  description: string;
  Mark: ComponentType;
}

// Every ProductMark is a fixed 280x280 scene (see product-mark.css); the
// wrapper below scales it down and clips the overflow rather than
// resizing it directly, same technique ProductHero uses to blow one up.
const MARK_SCALE = 0.32;
const MARK_BOX_PX = 280 * MARK_SCALE;

export function ProductMarkLink({
  slug,
  name,
  description,
  Mark,
}: ProductMarkLinkProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/products/${slug}`)}
      aria-label={`View ${name} product page`}
      className="group flex flex-col items-center gap-4 text-center"
    >
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden"
        style={{ width: MARK_BOX_PX, height: MARK_BOX_PX }}
      >
        <div style={{ transform: `scale(${MARK_SCALE})` }}>
          <Mark />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-display text-[24px] leading-[1] text-white transition-colors duration-300 group-hover:text-neutral-200">
          {name}
        </span>
        <p className="max-w-[220px] font-sans text-[13px] leading-[18px] text-neutral-400">
          {description}
        </p>
      </div>
    </button>
  );
}
