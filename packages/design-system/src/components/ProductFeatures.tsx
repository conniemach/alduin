import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Tab } from "./Tab";

/**
 * Figma "Product Features (Desktop)" / "(Mobile)" component set.
 * A tab bar (product name per tab) drives a content panel: shared
 * headline, per-product eyebrow/description/link, and a product image.
 * Purely click-driven (no auto-advance, unlike Features below) — but
 * reuses Features' crossfade (motion.featureCrossfade, 1.2s expo-out,
 * two permanently-mounted A/B slots) instead of a hard cut between
 * products, for the same reasons documented on Features: opacity-only
 * reads calmer than adding scale/slide, and pre-mounted slots avoid a
 * missed first frame. The per-product content block's height is locked
 * to the tallest product's copy (measured off an invisible stack) so
 * switching products never reflows the image below it.
 * Desktop shows headline and eyebrow/description as two side-by-side
 * columns (1140px content, 546/546 split); that collapses to a single
 * column on narrower viewports.
 * Layout rules: the tab bar is horizontally centered over the content
 * below it (not left-aligned), and the component always fills the full
 * width it's given — it never imposes its own max-width or side margins,
 * so it runs edge-to-edge up to whatever page padding the parent applies.
 */
export interface ProductFeatureItem {
  id: string;
  tabLabel: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  /** Swapped in via a `(max-width: 375px)` source when provided; falls back to imageSrc otherwise. */
  mobileImageSrc?: string;
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

type SlotId = "A" | "B";
const SLOTS: SlotId[] = ["A", "B"];

function ProductContent({ item }: { item: ProductFeatureItem }) {
  return (
    <>
      <span className="font-sans text-[12px] leading-[16.8px] tracking-[-0.12px] text-neutral-500">
        {item.eyebrow}
      </span>
      <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
        {item.description}
      </p>
      <button
        type="button"
        onClick={item.onLearnMore}
        className="w-fit font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-white"
      >
        Learn more ↗
      </button>
    </>
  );
}

export function ProductFeatures({
  headline = DEFAULT_HEADLINE,
  items,
  className,
}: ProductFeaturesProps) {
  const [current, setCurrent] = useState(0);
  const [slotItem, setSlotItem] = useState<Record<SlotId, number>>({
    A: 0,
    B: 0,
  });
  const [activeSlot, setActiveSlot] = useState<SlotId>("A");

  const currentRef = useRef(current);
  const activeSlotRef = useRef<SlotId>(activeSlot);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [contentHeight, setContentHeight] = useState<number>();

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  const measure = useCallback(() => {
    const max = Math.max(
      0,
      ...measureRefs.current.map((el) => el?.offsetHeight ?? 0),
    );
    if (max > 0) setContentHeight(max);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items]);

  const goTo = useCallback((i: number) => {
    if (i === currentRef.current) return;
    const nextSlot: SlotId = activeSlotRef.current === "A" ? "B" : "A";
    setSlotItem((prev) => ({ ...prev, [nextSlot]: i }));
    setActiveSlot(nextSlot);
    setCurrent(i);
  }, []);

  if (!items[current]) return null;

  return (
    <div className={clsx("flex w-full flex-col gap-12 pb-20 pt-10", className)}>
      <div className="inline-flex w-fit items-center gap-3 self-center rounded-full bg-neutral-850 px-4 py-2">
        {items.map((item, i) => (
          <Tab key={item.id} active={i === current} onClick={() => goTo(i)}>
            {item.tabLabel}
          </Tab>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-12 md:flex-row">
          <p className="flex-1 font-mono text-[32px] leading-[38.4px] text-white">
            {headline}
          </p>
          <div className="relative flex-1" style={{ minHeight: contentHeight }}>
            {SLOTS.map((slot) => {
              const item = items[slotItem[slot]];
              if (!item) return null;
              const isFront = slot === activeSlot;
              return (
                <div
                  key={slot}
                  className={clsx(
                    "absolute inset-0 flex flex-col gap-3 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isFront ? "opacity-100" : "opacity-0",
                  )}
                >
                  <ProductContent item={item} />
                </div>
              );
            })}

            {/* Invisible measuring stack, same technique as Features. */}
            <div
              className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10"
              aria-hidden="true"
            >
              {items.map((item, i) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    measureRefs.current[i] = el;
                  }}
                  className="flex flex-col gap-3"
                >
                  <ProductContent item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative aspect-[1140/424] w-full overflow-hidden">
          {SLOTS.map((slot) => {
            const item = items[slotItem[slot]];
            if (!item) return null;
            const isFront = slot === activeSlot;
            return (
              <picture key={slot}>
                {item.mobileImageSrc && (
                  <source media="(max-width: 375px)" srcSet={item.mobileImageSrc} />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageSrc}
                  alt={isFront ? item.imageAlt : ""}
                  aria-hidden={!isFront}
                  onClick={isFront ? item.onLearnMore : undefined}
                  className={clsx(
                    "absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isFront ? "opacity-100" : "pointer-events-none opacity-0",
                    isFront && item.onLearnMore && "cursor-pointer",
                  )}
                />
              </picture>
            );
          })}
        </div>
      </div>
    </div>
  );
}
