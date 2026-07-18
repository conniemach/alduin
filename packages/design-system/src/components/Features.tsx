import { useEffect, useState, useCallback, useRef } from "react";
import clsx from "clsx";
import { motion } from "../tokens/motion";

/**
 * Figma "Features (Desktop)" / "(Mobile)" component set (Feature=1/2/3).
 * Auto-advancing carousel — Figma's own prototype specifies a 5s
 * AFTER_TIMEOUT trigger cycling the slides, with dot-click jumping
 * directly to a slide (300ms ease-out). Auto-advance pauses while a
 * user is actively interacting with the dots, then resumes — standard
 * carousel behavior, not explicit in the Figma file but implied by it.
 *
 * Note: the source collages each slide's image area from 3 overlapping
 * screenshot fragments at fixed pixel positions. That's simplified here
 * to a single full-bleed image per slide (via `imageSrc`) rather than
 * reproducing the exact overlap, since the fragments aren't meaningful
 * outside their original absolute layout.
 */
export interface FeatureSlide {
  id: string;
  heading: string;
  subheading: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

export interface FeaturesProps {
  slides: FeatureSlide[];
  className?: string;
}

export function Features({ slides, className }: FeaturesProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, motion.carouselInterval);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (i: number) => {
    setIndex(i);
    startTimer();
  };

  const active = slides[index];
  if (!active) return null;

  return (
    <div className={clsx("flex flex-col gap-12 pb-20 pt-10", className)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <p className="font-mono text-[32px] leading-[38.4px] text-white">
            {active.heading}
          </p>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
              {active.subheading}
            </p>
            <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
              {active.body}
            </p>
          </div>
        </div>

        <div className="aspect-[1140/348] w-full overflow-hidden rounded-lg bg-neutral-850">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.imageSrc}
            alt={active.imageAlt}
            className="size-full object-cover transition-opacity duration-300 ease-out"
            key={active.id}
          />
        </div>
      </div>

      <div className="inline-flex w-fit items-center gap-3 rounded-full bg-neutral-850 px-4 py-2">
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={clsx(
                "h-3 rounded-full transition-[width,background-color] duration-300 ease-out",
                i === index ? "w-8 bg-white" : "w-3 bg-neutral-200",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
