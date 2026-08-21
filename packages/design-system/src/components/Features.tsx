import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { ProductScene } from "./ProductScene";
import type { ProductSceneMode } from "../lib/product-scene-draw";
import { ProductZoomScene } from "./ProductZoomScene";
import type { CameraStop } from "../lib/product-zoom-scene";

/**
 * PDP feature callouts — one per specialty capability, navigated by
 * scrolling rather than an auto-advancing timer. This mirrors the site's
 * "Problem" -> "Solution" scroll-pinned panel (see the About page's
 * ProblemSolutionScroll), generalized from a fixed 2 steps to however
 * many slides are passed in, and reusing the exact same mechanics:
 * - The wrapper is taller than its sticky inner panel by a fixed
 *   per-step scroll budget (PIN_PX_PER_STEP), so the panel stays pinned
 *   under the nav while the user scrolls through every slide — same
 *   PIN_PX_PER_STEP (220px) as ProblemSolutionScroll's own budget
 *   (440px / 2 steps), so the two sections feel like the same pace.
 * - A thin vertical track on the left fills top-to-bottom with scroll
 *   progress, next to a list of every slide's heading — the active one
 *   white, the rest neutral-500, exactly like ProblemSolutionScroll's
 *   step labels.
 * - The subheading/body copy and the visual below it crossfade between
 *   slides (motion.featureCrossfade's curve, hardcoded here the same
 *   way the original carousel version did) on a shared two-slot A/B
 *   swap, retriggered whenever scroll progress crosses into a new
 *   slide's third of the range — same crossfade technique as before,
 *   just driven by scroll position instead of a timer or a dot click.
 *
 * Deliberately different from ProblemSolutionScroll in one respect: the
 * visual stage here is much taller (SCENE_HEIGHT_PX) than that panel's
 * 120px zipper-merge motif. A live product visualization needs real
 * room to read; a fixed px height (not an aspect ratio tied to
 * container width) keeps that height predictable regardless of the
 * page's content width. The sticky panel's own height is still capped
 * to the visible viewport (see the `min(...)` in the measure effect
 * below) so a tall stage never sticks past the fold and becomes
 * partially unreachable on shorter screens.
 *
 * Below the `md` breakpoint there's no scroll runway to hijack sensibly
 * (viewport-height math gets unreliable with mobile browser chrome), so
 * it falls back to every slide stacked statically — same fallback
 * ProblemSolutionScroll uses.
 *
 * Callers should NOT wrap this in ScrollReveal: its own IntersectionObserver
 * fade doesn't cooperate with a pinned/sticky panel (see the comment on
 * the section below ProblemSolutionScroll on the About page, which hit
 * the same issue) — the panel is naturally in view for the whole pin.
 */
export interface FeatureSlide {
  id: string;
  heading: string;
  subheading: string;
  /** Accepts JSX (e.g. a bolded lead-in phrase before the rest of the copy), not just plain text. */
  body: ReactNode;
  /** A live ProductScene animation, keyed to the capability it represents. Takes priority over imageSrc when set. */
  scene?: ProductSceneMode;
  imageSrc: string;
  imageAlt: string;
}

export interface FeaturesProps {
  slides: FeatureSlide[];
  className?: string;
  /**
   * When set, replaces the per-slide crossfading visual stage with one
   * continuous camera move across a single shared map (see
   * lib/product-zoom-scene.ts) — for when the slides' whole story is a
   * literal zoom (local hazard detail <-> global picture) rather than a
   * sequence of otherwise-unrelated visuals. `stops` should have one
   * entry per slide, in the same order.
   */
  zoomScene?: { stops: CameraStop[] };
}

// Matches GlobalNav's fixed h-[116px] — same offset ProblemSolutionScroll
// pins its own panel under.
const NAV_HEIGHT_PX = 116;

// Per-step scroll budget, carried over from ProblemSolutionScroll's
// 440px / 2 steps. Multiplied by slide count below so a 3-slide section
// gets 3x the scroll runway a 2-step one would.
const PIN_PX_PER_STEP = 220;

// Taller than ProblemSolutionScroll's 120px zipper stage on purpose — a
// live product visualization needs real room to read, unlike that
// panel's small three-dots-merging motif.
const SCENE_HEIGHT_PX = 520;

const CROSSFADE_CLASS = "duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
const TRACK_MS = 150;
const TRACK_EASE = "ease-out";

type SlotId = "A" | "B";
const SLOTS: SlotId[] = ["A", "B"];

function SlideBody({ slide }: { slide: FeatureSlide }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
        {slide.subheading}
      </p>
      <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
        {slide.body}
      </p>
    </div>
  );
}

function SlideVisual({ slide, isFront }: { slide: FeatureSlide; isFront: boolean }) {
  const crossfadeClassName = clsx(
    "absolute inset-0 size-full transition-opacity",
    CROSSFADE_CLASS,
    isFront ? "opacity-100" : "pointer-events-none opacity-0",
  );
  if (slide.scene) {
    return (
      <div
        role="img"
        aria-label={isFront ? slide.imageAlt : undefined}
        aria-hidden={!isFront}
        className={crossfadeClassName}
      >
        <ProductScene mode={slide.scene} className="size-full" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={slide.imageSrc}
      alt={isFront ? slide.imageAlt : ""}
      aria-hidden={!isFront}
      className={clsx(crossfadeClassName, "object-cover")}
    />
  );
}

export function Features({ slides, className, zoomScene }: FeaturesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const pinScrollPx = PIN_PX_PER_STEP * Math.max(1, slides.length);
  const [stickyHeight, setStickyHeight] = useState(`calc(100vh - ${NAV_HEIGHT_PX}px)`);
  const [wrapperHeight, setWrapperHeight] = useState(
    `calc(100vh - ${NAV_HEIGHT_PX}px + ${pinScrollPx}px)`,
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    function measure() {
      if (!wrapper || !content) return;
      const contentHeight = content.getBoundingClientRect().height;
      // Centers the panel on its own content height, same idea as
      // ProblemSolutionScroll, but capped with min() to the visible
      // viewport so a tall scene stage never sticks past the fold.
      const stickyExpr = `min(50vh - ${NAV_HEIGHT_PX / 2}px + ${contentHeight / 2}px, 100vh - ${NAV_HEIGHT_PX}px)`;
      setStickyHeight(`calc(${stickyExpr})`);
      setWrapperHeight(`calc(${stickyExpr} + ${pinScrollPx}px)`);

      const wrapperRect = wrapper.getBoundingClientRect();
      const raw = (NAV_HEIGHT_PX - wrapperRect.top) / pinScrollPx;
      const clamped = Math.min(1, Math.max(0, raw));
      progressRef.current = clamped;
      setProgress(clamped);
    }

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pinScrollPx]);

  const stepIndex = Math.min(
    slides.length - 1,
    Math.floor(progress * slides.length),
  );

  const [activeSlot, setActiveSlot] = useState<SlotId>("A");
  const [slotSlide, setSlotSlide] = useState<Record<SlotId, number>>({ A: 0, B: 0 });
  const activeSlotRef = useRef(activeSlot);
  const slotSlideRef = useRef(slotSlide);

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);
  useEffect(() => {
    slotSlideRef.current = slotSlide;
  }, [slotSlide]);

  useEffect(() => {
    if (slotSlideRef.current[activeSlotRef.current] === stepIndex) return;
    const nextSlot: SlotId = activeSlotRef.current === "A" ? "B" : "A";
    setSlotSlide((prev) => ({ ...prev, [nextSlot]: stepIndex }));
    setActiveSlot(nextSlot);
  }, [stepIndex]);

  // Locks the copy block's height to the tallest slide's, same technique
  // (and same reason) as the original carousel: shorter/longer copy
  // shouldn't reflow the gap above the visual stage.
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [bodyHeight, setBodyHeight] = useState<number>();

  const measureBody = useCallback(() => {
    const max = Math.max(0, ...measureRefs.current.map((el) => el?.offsetHeight ?? 0));
    if (max > 0) setBodyHeight(max);
  }, []);

  useLayoutEffect(() => {
    measureBody();
    window.addEventListener("resize", measureBody);
    return () => window.removeEventListener("resize", measureBody);
  }, [measureBody, slides]);

  if (!slides[stepIndex]) return null;

  return (
    <div className={clsx("flex w-full flex-col pb-20 pt-10", className)}>
      {/* Desktop/tablet: scroll-pinned panel. */}
      <div ref={wrapperRef} className="relative hidden md:block" style={{ height: wrapperHeight }}>
        <div
          className="sticky flex flex-col justify-center"
          style={{ top: NAV_HEIGHT_PX, height: stickyHeight }}
        >
          <div ref={contentRef} className="flex gap-16">
            <div className="flex w-[340px] shrink-0 gap-8">
              <div className="relative w-px shrink-0 self-stretch rounded-full bg-white/15">
                <div
                  className="absolute inset-x-0 top-0 w-px rounded-full bg-white"
                  style={{
                    height: `${progress * 100}%`,
                    transition: `height ${TRACK_MS}ms ${TRACK_EASE}`,
                  }}
                />
              </div>
              {/* justify-between (not a fixed gap) so headings spread
                  evenly across the full stretched height of this column
                  — matching the track/scene column's height — rather
                  than clumping near the top and leaving the progress
                  track's fill run past a long stretch of nothing below
                  the last title. */}
              <div className="flex flex-col justify-between py-1">
                {slides.map((slide, i) => (
                  <span
                    key={slide.id}
                    className={clsx(
                      "font-condensed text-[28px] leading-[33.6px] transition-colors",
                      CROSSFADE_CLASS,
                      i === stepIndex ? "text-white" : "text-neutral-500",
                    )}
                  >
                    {slide.heading}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <div className="relative" style={{ minHeight: bodyHeight }}>
                {SLOTS.map((slot) => {
                  const slide = slides[slotSlide[slot]];
                  if (!slide) return null;
                  const isFront = slot === activeSlot;
                  return (
                    <div
                      key={slot}
                      aria-hidden={!isFront}
                      className={clsx(
                        "absolute inset-0 transition-opacity",
                        CROSSFADE_CLASS,
                        isFront ? "opacity-100" : "pointer-events-none opacity-0",
                      )}
                    >
                      <SlideBody slide={slide} />
                    </div>
                  );
                })}
                {/* Invisible measuring stack: every slide's copy rendered
                    at the same width so we can read its natural height
                    and lock the visible block to the tallest one. */}
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
                    >
                      <SlideBody slide={slide} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="relative w-full shrink-0 overflow-hidden rounded-[20px] border border-white/10"
                style={{ height: SCENE_HEIGHT_PX }}
              >
                {zoomScene ? (
                  <ProductZoomScene activeIndex={stepIndex} stops={zoomScene.stops} className="size-full" />
                ) : (
                  SLOTS.map((slot) => {
                    const slide = slides[slotSlide[slot]];
                    if (!slide) return null;
                    return <SlideVisual key={slot} slide={slide} isFront={slot === activeSlot} />;
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fallback: every slide stacked, no pin/scrollbar. With
          zoomScene, each slide gets a static snapshot at its own stop's
          exact position (no pullback dip, since that only happens
          between two stops) rather than the animated camera move —
          there's no scroll-pin here to drive it continuously. */}
      <div className="flex flex-col gap-14 md:hidden">
        {slides.map((slide, i) => (
          <div key={slide.id} className="flex flex-col gap-5">
            <p className="font-condensed text-[24px] leading-[28.8px] text-white">{slide.heading}</p>
            <SlideBody slide={slide} />
            <div
              className="relative w-full overflow-hidden rounded-[20px] border border-white/10"
              style={{ height: SCENE_HEIGHT_PX * 0.6 }}
            >
              {zoomScene ? (
                <ProductZoomScene activeIndex={i} stops={zoomScene.stops} className="size-full" />
              ) : slide.scene ? (
                <ProductScene mode={slide.scene} className="size-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.imageSrc} alt={slide.imageAlt} className="size-full object-cover" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
