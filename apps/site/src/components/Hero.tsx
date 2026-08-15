"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLinkout, SplitFlapText } from "@alduin/design-system";
import { useFisheyeGlobe } from "./hero-globe/useFisheyeGlobe";

// Same landing treatment as ProductHero's mark: a short delay then a
// gentle fade/scale-in, softening the arrival instead of dropping
// everything in at once. Unlike ProductHero (where only the mark
// animates and the text stays put, since there's nothing else on that
// page to sequence against), the homepage hero's globe and text share
// this same timing so the whole section lands as one composed moment
// rather than the globe animating in behind already-settled copy.
const REVEAL_DELAY_MS = 300;
const REVEAL_MS = 1400;
const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// How far past "NOISE" (in px) the dip's right edge sits.
const DIP_END_OFFSET_PX = 20;
// Width of the fade in/out around each threshold, so the opacity change
// reads as a gradual blend into black and back rather than a hard cut
// right at the text edge.
const DIP_RAMP_PX = 400;
// Subtle vignette right at the container's literal left/right edges —
// unrelated to the text dip, just keeps the canvas from stopping with a
// hard seam at the screen edge.
const EDGE_FADE_PCT = 3;

type MaskGeometry = { startPct: number; endPct: number } | null;

// Locates "SIGNAL"'s left edge and "NOISE"'s right edge (+ offset) within
// the globe container, in percent of its width, so the dim zone tracks the
// actual rendered headline instead of a hardcoded guess that only lines up
// at one viewport size.
function measureMaskGeometry(
  container: HTMLElement,
  headlineWrap: HTMLElement,
): MaskGeometry {
  const glyphRoot = headlineWrap.querySelector('h1 > span[aria-hidden="true"]');
  const chars = glyphRoot ? Array.from(glyphRoot.children) : [];
  if (chars.length === 0) return null;

  const containerRect = container.getBoundingClientRect();
  if (containerRect.width === 0) return null;

  const firstRect = chars[0]!.getBoundingClientRect();
  const lastRect = chars[chars.length - 1]!.getBoundingClientRect();

  const startPct = ((firstRect.left - containerRect.left) / containerRect.width) * 100;
  const endPct =
    ((lastRect.right + DIP_END_OFFSET_PX - containerRect.left) / containerRect.width) * 100;

  return { startPct, endPct };
}

function buildMaskGradient(geometry: MaskGeometry, containerWidth: number) {
  if (!geometry || containerWidth === 0) {
    return `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${EDGE_FADE_PCT}%, rgba(0,0,0,0) ${100 - EDGE_FADE_PCT}%, rgba(0,0,0,1) 100%)`;
  }

  const rampPct = (DIP_RAMP_PX / containerWidth) * 100;
  const { startPct, endPct } = geometry;

  const leftEdge = Math.min(EDGE_FADE_PCT, Math.max(0, startPct - rampPct));
  const rightEdge = 100 - Math.min(EDGE_FADE_PCT, Math.max(0, 100 - endPct - rampPct));
  const rampInStart = Math.max(leftEdge, startPct - rampPct);
  const rampOutEnd = Math.min(rightEdge, endPct + rampPct);

  return [
    "linear-gradient(90deg",
    "rgba(0,0,0,1) 0%",
    `rgba(0,0,0,0) ${leftEdge}%`,
    `rgba(0,0,0,0) ${rampInStart}%`,
    `rgba(0,0,0,0.7) ${startPct}%`,
    `rgba(0,0,0,0.7) ${endPct}%`,
    `rgba(0,0,0,0) ${rampOutEnd}%`,
    `rgba(0,0,0,0) ${rightEdge}%`,
    "rgba(0,0,0,1) 100%)",
  ].join(", ");
}

export function Hero() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  useFisheyeGlobe(canvasRef, globeContainerRef);

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const [maskGeometry, setMaskGeometry] = useState<MaskGeometry>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const container = globeContainerRef.current;
    const headlineWrap = headlineWrapRef.current;
    if (!container || !headlineWrap) return;

    function measure() {
      if (!container || !headlineWrap) return;
      setContainerWidth(container.getBoundingClientRect().width);
      setMaskGeometry(measureMaskGeometry(container, headlineWrap));
    }

    measure();
    // Re-measure once the reveal scale/opacity transition settles (the
    // transform shifts the headline's rendered rect mid-animation) and on
    // resize, so the dip stays locked to the text at any viewport width.
    const settleTimer = setTimeout(measure, REVEAL_DELAY_MS + REVEAL_MS + 50);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      // -mt-[116px] + the matching extra top padding pulls the section
      // up under GlobalNav (fixed, h-[116px], transparent/blurred — see
      // its own comment) so the globe renders behind the nav instead of
      // stopping right where the nav's fade ends. The extra padding
      // keeps the headline at the same visual position it was at
      // before: the negative margin and the added padding cancel out,
      // so this doesn't change layout for anything below the hero.
      className="relative -mt-[116px] flex min-h-[650px] flex-col justify-center overflow-hidden bg-black pb-[40px] pt-[24px]"
    >
      <div
        ref={globeContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          opacity: revealed ? 1 : 0,
          transform: `scale(${revealed ? 1 : 0.92})`,
          transition: `opacity ${REVEAL_MS}ms ${REVEAL_EASE}, transform ${REVEAL_MS}ms ${REVEAL_EASE}`,
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 scale-110 rounded-full bg-white/[0.03] blur-3xl" />
        {/* faint scanline texture — sells "screen", not "wallpaper" */}
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)",
          }}
        />
        {/* The mask: fades to black on all four edges (blends into the
            nav above, whatever follows below, and doesn't just stop at
            the canvas boundary left/right); and horizontally, dips to
            30% opacity across the headline — from "SIGNAL"'s left edge
            to 20px past "NOISE"'s right edge, measured off the actual
            rendered text via measureMaskGeometry — so the globe reads
            as texture rather than competing with the copy, then holds
            full strength everywhere else. */}
        <div
          className="absolute inset-0"
          style={{
            background: `${buildMaskGradient(maskGeometry, containerWidth)}, linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0) 85%, rgba(0,0,0,1) 100%)`,
          }}
        />
      </div>
      <div className="relative mx-auto w-full max-w-[1440px] px-[70px] min-[1440px]:px-[150px]">
        <div
          className="flex flex-col gap-10"
          style={{
            opacity: revealed ? 1 : 0,
            transform: `scale(${revealed ? 1 : 0.96})`,
            transition: `opacity ${REVEAL_MS}ms ${REVEAL_EASE}, transform ${REVEAL_MS}ms ${REVEAL_EASE}`,
          }}
        >
          <div ref={headlineWrapRef} className="flex max-w-[632px] flex-col gap-0">
            <SplitFlapText
              text="SIGNAL OVER NOISE"
              className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]"
            />
            <p className="mt-4 font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
              Secure software built for teams that need clarity, resilience,
              and command-grade visibility
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Button onClick={() => router.push("/request-a-demo")}>
              Request a Demo
            </Button>
            <ButtonLinkout onClick={() => router.push("/pricing")}>
              View Pricing
            </ButtonLinkout>
          </div>
        </div>
      </div>
    </section>
  );
}
