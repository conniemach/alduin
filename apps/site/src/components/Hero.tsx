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

export function Hero() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  useFisheyeGlobe(canvasRef, globeContainerRef);

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
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
            the canvas boundary left/right); and horizontally, holds the
            left ~60% (where the copy sits) at ~20% opacity so the globe
            reads as texture rather than competing with the text, then
            ramps up to full strength across the right ~40%. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 8%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0) 62%, rgba(0,0,0,0) 86%, rgba(0,0,0,1) 100%), linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0) 85%, rgba(0,0,0,1) 100%)",
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
          <div className="flex max-w-[632px] flex-col gap-0">
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
