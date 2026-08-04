"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLinkout } from "@alduin/design-system";
import { useFisheyeGlobe } from "./hero-globe/useFisheyeGlobe";

export function Hero() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  useFisheyeGlobe(canvasRef, globeContainerRef);

  return (
    <section
      // -mt-[116px] + the matching extra top padding pulls the section
      // up under GlobalNav (fixed, h-[116px], transparent/blurred — see
      // its own comment) so the globe renders behind the nav instead of
      // stopping right where the nav's fade ends. The extra padding
      // keeps the headline at the same visual position it was at
      // before: the negative margin and the added padding cancel out,
      // so this doesn't change layout for anything below the hero.
      className="relative -mt-[116px] flex min-h-[650px] flex-col justify-center overflow-hidden bg-black px-[70px] pb-[40px] pt-[24px] min-[1441px]:px-[150px]"
    >
      <div
        ref={globeContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
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
      <div className="relative flex flex-col gap-10">
        <div className="flex max-w-[632px] flex-col gap-0">
          <h1 className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]">
            SIGNAL OVER NOISE
          </h1>
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
    </section>
  );
}
