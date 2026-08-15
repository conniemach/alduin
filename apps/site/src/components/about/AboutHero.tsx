"use client";

import { useRef } from "react";
import { useGroundedMap } from "./useGroundedMap";

/**
 * The About page's hero — the world map background is the "Grounded
 * Map Ping" concept from the hero-animation exploration: real
 * coastline data (same dataset as the homepage globe), a sonar-style
 * ping broadcasting from a fixed point, and a few status-colored
 * contact markers. Landed here after a plain radial sweep kept
 * reading as an orbit/star-chart diagram regardless of styling —
 * grounding the same mechanic on correctly-rendered terrain fixed
 * that outright.
 */
export function AboutHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useGroundedMap(canvasRef, containerRef);

  return (
    <section className="relative mx-auto flex min-h-[560px] max-w-[1440px] items-start overflow-hidden bg-black px-[70px] pb-20 pt-5 min-[1440px]:px-[150px]">
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.32) 46%, rgba(0,0,0,0) 66%)",
          }}
        />
        {/* faint scanline texture — matches the homepage hero's "screen" treatment */}
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)",
          }}
        />
      </div>
      <div className="relative flex flex-col gap-10 py-[110px]">
        <div className="flex max-w-[632px] flex-col gap-0">
          <h1 className="font-science-gothic text-[28px] leading-[1.1] text-white md:text-[48px] lg:text-[52px]">
            CLARITY UNDER PRESSURE
          </h1>
          <p className="mt-4 font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
            Alduin exists for the teams making high-stakes calls under
            fire, under deadline, under scrutiny—command centers,
            security desks, and investigators who can&rsquo;t afford to
            guess.
          </p>
        </div>
      </div>
    </section>
  );
}
