import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { motion } from "../tokens/motion";

/**
 * Figma "Features (Desktop)" / "(Mobile)" component set (Feature=1/2/3).
 * Auto-advancing carousel — Figma's own prototype specifies a 5s
 * AFTER_TIMEOUT trigger cycling the slides, with dot-click jumping
 * directly to a slide (300ms ease-out). Auto-advance pauses while a
 * user is actively interacting with the dots, then resumes — standard
 * carousel behavior, not explicit in the Figma file but implied by it.
 * The 5s has since been widened to motion.carouselInterval (8s), see
 * that token for why.
 *
 * Note: the source collages each slide's image area from 3 overlapping
 * screenshot fragments at fixed pixel positions. That's simplified here
 * to a single full-bleed image per slide (via `imageSrc`) rather than
 * reproducing the exact overlap, since the fragments aren't meaningful
 * outside their original absolute layout.
 *
 * Layout/motion rules:
 * - The component always fills the full width it's given — it never
 *   imposes its own max-width or side margins, so it runs edge-to-edge
 *   up to whatever page padding the parent applies (same rule as
 *   ProductFeatures).
 * - The dot nav is horizontally centered under the content, not
 *   left-aligned.
 * - Slide changes cross-dissolve (motion.featureCrossfade, 1.2s, a slow
 *   "expo-out" curve). Deliberately just opacity — no scale, no blur, no
 *   directional slide — since layering more motion on top read as busier
 *   rather than gentler; a long, plain, smoothly-decelerating fade is
 *   what actually reads as calm. Uses two permanently-mounted slots
 *   (A/B) rather than mounting/unmounting a layer per transition:
 *   whichever slot is currently hidden gets the incoming slide's content
 *   and is then made the visible one, while the other fades out. Because
 *   both slots already exist in the DOM before a transition starts, the
 *   browser always has a real "opacity: 0" frame to animate from — no
 *   dependence on rAF timing to catch the transition before paint, which
 *   is what made an earlier mount-per-transition version prone to
 *   reading as an instant cut.
 * - The text block's height is locked to the tallest slide (measured
 *   off an invisible copy of every slide) so shorter/longer copy never
 *   reflows the gap above the image — the image never jumps vertically
 *   or overlaps the text when the active slide changes.
 * - The active dot fills horizontally like a countdown, in sync with
 *   the auto-advance timer, so it's visible how long until the next
 *   slide — resets on every transition, whether that's the timer or a
 *   manual click.
 */
export interface FeatureSlide {
  id: string;
  heading: string;
  subheading: string;
  /** Accepts JSX (e.g. a bolded lead-in phrase before the rest of the copy), not just plain text. */
  body: ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export interface FeaturesProps {
  slides: FeatureSlide[];
  className?: string;
}

type SlotId = "A" | "B";
const SLOTS: SlotId[] = ["A", "B"];

function SlideText({ slide }: { slide: FeatureSlide }) {
  return (
    <>
      <p className="font-mono text-[32px] leading-[38.4px] text-white">
        {slide.heading}
      </p>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
          {slide.subheading}
        </p>
        <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
          {slide.body}
        </p>
      </div>
    </>
  );
}

export function Features({ slides, className }: FeaturesProps) {
  const [current, setCurrent] = useState(0);
  const [slotSlide, setSlotSlide] = useState<Record<SlotId, number>>({
    A: 0,
    B: 0,
  });
  const [activeSlot, setActiveSlot] = useState<SlotId>("A");
  const [progressActive, setProgressActive] = useState(false);

  const currentRef = useRef(current);
  const activeSlotRef = useRef<SlotId>(activeSlot);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRafRef = useRef<number | null>(null);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [textHeight, setTextHeight] = useState<number>();

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
    if (max > 0) setTextHeight(max);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, slides]);

  // Restarts the active dot's fill every time the slide changes, whether
  // that's the auto-advance timer or a manual click.
  useEffect(() => {
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    setProgressActive(false);
    progressRafRef.current = requestAnimationFrame(() => {
      progressRafRef.current = requestAnimationFrame(() => {
        setProgressActive(true);
      });
    });
    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
  }, [current]);

  const transitionTo = useCallback((i: number) => {
    if (i === currentRef.current) return;
    const nextSlot: SlotId = activeSlotRef.current === "A" ? "B" : "A";
    setSlotSlide((prev) => ({ ...prev, [nextSlot]: i }));
    setActiveSlot(nextSlot);
    setCurrent(i);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      transitionTo((currentRef.current + 1) % slides.length);
    }, motion.carouselInterval);
  }, [slides.length, transitionTo]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (i: number) => {
    transitionTo(i);
    startTimer();
  };

  if (!slides[current]) return null;

  return (
    <div className={clsx("flex w-full flex-col gap-12 pb-20 pt-10", className)}>
      <div className="relative flex flex-col gap-10">
        <div className="relative" style={{ minHeight: textHeight }}>
          {SLOTS.map((slot) => {
            const slide = slides[slotSlide[slot]];
            if (!slide) return null;
            const isFront = slot === activeSlot;
            return (
              <div
                key={slot}
                className={clsx(
                  "absolute inset-0 flex flex-col gap-5 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isFront ? "opacity-100" : "opacity-0",
                )}
              >
                <SlideText slide={slide} />
              </div>
            );
          })}
        </div>

        <div className="relative aspect-[1140/348] w-full overflow-hidden">
          {SLOTS.map((slot) => {
            const slide = slides[slotSlide[slot]];
            if (!slide) return null;
            const isFront = slot === activeSlot;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slot}
                src={slide.imageSrc}
                alt={isFront ? slide.imageAlt : ""}
                aria-hidden={!isFront}
                className={clsx(
                  "absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isFront ? "opacity-100" : "opacity-0",
                )}
              />
            );
          })}
        </div>

        {/* Invisible measuring stack: every slide's text rendered at the
            same width so we can read its natural height and lock the
            visible block to the tallest one. Out of flow (absolute), so
            it never affects real layout. Needs `relative` on this parent
            (not just the text block above) so `inset-x-0` resolves
            against this component's own width rather than some
            farther-up positioned ancestor. */}
        <div
          className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10"
          aria-hidden="true"
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => {
                measureRefs.current[i] = el;
              }}
              className="flex flex-col gap-5"
            >
              <SlideText slide={slide} />
            </div>
          ))}
        </div>
      </div>

      <div className="inline-flex w-fit items-center gap-3 self-center rounded-full bg-neutral-850 px-4 py-2">
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              onClick={() => goTo(i)}
              className={clsx(
                "relative h-3 overflow-hidden rounded-full transition-[width,background-color] duration-300 ease-out",
                i === current ? "w-8 bg-white/25" : "w-3 bg-neutral-200",
              )}
            >
              {i === current && (
                <span
                  className={clsx(
                    "absolute inset-y-0 left-0 rounded-full bg-white",
                    progressActive ? "ease-linear" : "transition-none",
                  )}
                  style={{
                    width: progressActive ? "100%" : "0%",
                    transitionProperty: "width",
                    transitionDuration: progressActive
                      ? `${motion.carouselInterval}ms`
                      : "0ms",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
