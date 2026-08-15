"use client";

import { useEffect, useRef, useState } from "react";
import { useZipperMerge } from "./useZipperMerge";

// Matches GlobalNav's fixed h-[116px] (see its own comment) — the sticky
// panel pins right under the nav, same offset every other section on this
// page already builds its layout around.
const NAV_HEIGHT_PX = 116;

// Scroll distance (px) dedicated to the pin — real distance to scroll
// through both steps while pinned, short enough that it doesn't feel like
// a stuck page. Fixed in px rather than tied to the sticky panel's own
// height, so shrinking the panel (see stickyHeight below) doesn't
// balloon this out.
const PIN_SCROLL_PX = 440;

// Crossfade timing for the paragraph swap — same curve/duration
// ProductFeatures uses for its tab crossfade (motion.featureCrossfade),
// kept as a local constant since this file (like Hero.tsx) doesn't pull
// from the design-system's motion tokens.
const CROSSFADE_MS = 1200;
const CROSSFADE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Progress-bar fill responds quickly to scroll input rather than lagging
// behind it — this is the "scrollbar", not a slow narrative reveal.
const TRACK_MS = 150;
const TRACK_EASE = "ease-out";

type StepId = "problem" | "solution";

const STEPS: { id: StepId; label: string; body: string }[] = [
  {
    id: "problem",
    label: "THE PROBLEM",
    body: "Like many operators, we relied on platforms that were expensive, slow, and visually cluttered—built around the assumptions of software developers rather than the realities of operational work. Critical information was scattered across multiple applications, simple tasks required unnecessary effort, and many systems felt years behind the environments they were supposed to support.",
  },
  {
    id: "solution",
    label: "OUR SOLUTION",
    body: "Operational software should help people think clearly under pressure by reducing cognitive load, presenting critical information with purpose rather than burying it beneath unnecessary menus, dashboards, or visual noise. A clean, modern interface isn’t just about aesthetics—it improves readability, reduces fatigue, and empowers users to process information faster when every second matters.",
  },
];

type SlotId = "A" | "B";
const SLOTS: SlotId[] = ["A", "B"];

export interface ProblemSolutionScrollProps {
  // Fires on every scroll-driven progress update (0-1) so the page can
  // sync other sections to it — e.g. the section right below sits in a
  // dead zone while this one is still pinned, and used to just be an
  // empty gap until its own ScrollReveal happened to trigger.
  onProgressChange?: (progress: number) => void;
}

/**
 * Scroll-pinned "Problem" -> "Solution" panel. The wrapper is taller than
 * its sticky inner panel by PIN_SCROLL_PX, so scrolling through it holds
 * the panel in place while a progress bar in the left
 * column fills and the step crossfades from Problem to Solution — the
 * user has to scroll through the whole transition to reach the next
 * section, rather than it just flashing past. Below md, there's no scroll
 * runway to hijack sensibly (viewport-height math gets unreliable with
 * mobile browser chrome), so it falls back to both steps stacked
 * statically, same as the page's other sections.
 */
export function ProblemSolutionScroll({ onProgressChange }: ProblemSolutionScrollProps = {}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const onProgressChangeRef = useRef(onProgressChange);
  useEffect(() => {
    onProgressChangeRef.current = onProgressChange;
  }, [onProgressChange]);
  // Read every animation frame by useZipperMerge instead of passed as a
  // prop, so the zip point's speed is a direct function of live scroll
  // position rather than lagging a render cycle behind it.
  const progressRef = useRef(0);
  // The sticky panel used to be a full `100vh - navHeight` box with
  // justify-center, which left ~400px of empty space above and below a
  // ~130px-tall content row. This halves that empty space (still
  // viewport-proportional, so it stays vertically centered at any
  // viewport height) — measured off the real content height rather than
  // a hardcoded px value so it still centers correctly if the copy's
  // line count ever changes. Wrapper height is derived from this same
  // value plus a fixed PIN_SCROLL_PX, so shrinking the panel doesn't
  // balloon the forced-scroll distance.
  const [stickyHeight, setStickyHeight] = useState(`calc(100vh - ${NAV_HEIGHT_PX}px)`);
  const [wrapperHeight, setWrapperHeight] = useState(`calc(100vh - ${NAV_HEIGHT_PX}px + ${PIN_SCROLL_PX}px)`);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    function measure() {
      if (!wrapper || !content) return;
      const contentHeight = content.getBoundingClientRect().height;
      const stickyExpr = `50vh - ${NAV_HEIGHT_PX / 2}px + ${contentHeight / 2}px`;
      setStickyHeight(`calc(${stickyExpr})`);
      setWrapperHeight(`calc(${stickyExpr} + ${PIN_SCROLL_PX}px)`);

      const wrapperRect = wrapper.getBoundingClientRect();
      const raw = (NAV_HEIGHT_PX - wrapperRect.top) / PIN_SCROLL_PX;
      const clamped = Math.min(1, Math.max(0, raw));
      progressRef.current = clamped;
      setProgress(clamped);
      onProgressChangeRef.current?.(clamped);
    }

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useZipperMerge(canvasRef, stageRef, progressRef);

  const stepIndex = progress < 0.5 ? 0 : 1;
  const [activeSlot, setActiveSlot] = useState<SlotId>("A");
  const [slotStep, setSlotStep] = useState<Record<SlotId, number>>({ A: 0, B: 0 });
  const activeSlotRef = useRef(activeSlot);
  const slotStepRef = useRef(slotStep);

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  useEffect(() => {
    slotStepRef.current = slotStep;
  }, [slotStep]);

  useEffect(() => {
    if (STEPS[slotStepRef.current[activeSlotRef.current]]?.id === STEPS[stepIndex]!.id) return;
    const nextSlot: SlotId = activeSlotRef.current === "A" ? "B" : "A";
    setSlotStep((prev) => ({ ...prev, [nextSlot]: stepIndex }));
    setActiveSlot(nextSlot);
  }, [stepIndex]);

  return (
    <>
      {/* Desktop/tablet: scroll-pinned panel. */}
      <div ref={wrapperRef} className="relative hidden md:block" style={{ height: wrapperHeight }}>
        <div
          ref={stickyRef}
          className="sticky flex flex-col justify-center"
          style={{ top: NAV_HEIGHT_PX, height: stickyHeight }}
        >
          <div ref={contentRef} className="flex gap-16">
            <div className="flex w-[280px] shrink-0 gap-8">
              <div className="relative w-px shrink-0 self-stretch rounded-full bg-white/15">
                <div
                  className="absolute inset-x-0 top-0 w-px rounded-full bg-white"
                  style={{
                    height: `${progress * 100}%`,
                    transition: `height ${TRACK_MS}ms ${TRACK_EASE}`,
                  }}
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                {STEPS.map((step, i) => (
                  <span
                    key={step.id}
                    className={`font-mono text-[32px] leading-[38.4px] transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      i === stepIndex ? "text-white" : "text-neutral-500"
                    }`}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <div className="relative">
                {SLOTS.map((slot) => {
                  const step = STEPS[slotStep[slot]];
                  if (!step) return null;
                  const isFront = slot === activeSlot;
                  return (
                    <p
                      key={slot}
                      aria-hidden={!isFront}
                      className={`absolute inset-0 font-sans text-[18px] leading-[27px] tracking-[-0.09px] text-neutral-300 ${
                        isFront ? "" : "pointer-events-none"
                      }`}
                      style={{
                        opacity: isFront ? 1 : 0,
                        transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE}`,
                      }}
                    >
                      {step.body}
                    </p>
                  );
                })}
                {/* Invisible measuring stack so the flex item takes the
                    taller of the two paragraphs' height even though the
                    actual copy above is absolutely positioned. */}
                <p
                  aria-hidden="true"
                  className="invisible font-sans text-[18px] leading-[27px] tracking-[-0.09px]"
                >
                  {STEPS[0]!.body.length > STEPS[1]!.body.length ? STEPS[0]!.body : STEPS[1]!.body}
                </p>
              </div>

              {/* Three scattered signals zip into one as the panel
                  scrolls through — the "multiple applications" of the
                  Problem copy converging into the "clean interface" of
                  the Solution copy, paced by the user's own scroll
                  speed. */}
              <div ref={stageRef} className="relative h-[120px] shrink-0 overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fallback: both steps stacked, no pin/scrollbar. */}
      <div className="flex flex-col gap-10 md:hidden">
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col gap-4">
            <span className="font-mono text-[24px] leading-[28.8px] text-white">{step.label}</span>
            <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
