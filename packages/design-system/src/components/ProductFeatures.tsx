import { useState } from "react";
import clsx from "clsx";
import { Tab } from "./Tab";

/**
 * Figma "Product Features (Desktop)" / "(Mobile)" component set.
 * A tab bar (product name per tab) drives a content panel: shared
 * headline, per-product eyebrow/description/link, and a product image.
 * Purely click-driven in Figma (no auto-advance, unlike Features below).
 * Desktop shows headline and eyebrow/description as two side-by-side
 * columns (1140px content, 546/546 split); that collapses to a single
 * column on narrower viewports.
 */
export interface ProductFeatureItem {
  id: string;
  tabLabel: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  onLearnMore?: () => void;
}

export interface ProductFeaturesProps {
  headline?: string;
  items: ProductFeatureItem[];
  className?: string;
}

const DEFAULT_HEADLINE =
  "Deployable independently. Integrated for unified intelligence.";

export function ProductFeatures({
  headline = DEFAULT_HEADLINE,
  items,
  className,
}: ProductFeaturesProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) return null;

  return (
    <div className={clsx("flex flex-col gap-12 pb-20 pt-10", className)}>
      <div className="inline-flex w-fit items-center gap-3 rounded-full bg-neutral-850 px-4 py-2">
        {items.map((item) => (
          <Tab
            key={item.id}
            active={item.id === active.id}
            onClick={() => setActiveId(item.id)}
          >
            {item.tabLabel}
          </Tab>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-12 md:flex-row">
          <p className="flex-1 font-mono text-[32px] leading-[38.4px] text-white">
            {headline}
          </p>
          <div className="flex flex-1 flex-col gap-3">
            <span className="font-sans text-[12px] leading-[16.8px] tracking-[-0.12px] text-neutral-500">
              {active.eyebrow}
            </span>
            <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
              {active.description}
            </p>
            <button
              type="button"
              onClick={active.onLearnMore}
              className="w-fit font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-white"
            >
              Learn more ↗
            </button>
          </div>
        </div>

        <div className="aspect-[1140/424] w-full overflow-hidden rounded-lg bg-neutral-850">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.imageSrc}
            alt={active.imageAlt}
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
