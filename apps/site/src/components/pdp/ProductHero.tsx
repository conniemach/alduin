"use client";

import { Button } from "@alduin/design-system";
import { useEffect, useState, type ComponentType } from "react";

export interface ProductHeroProps {
  name: string;
  description: string;
  Mark: ComponentType;
}

const REVEAL_DELAY_MS = 300;
const REVEAL_MS = 1400;
const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function ProductHero({ name, description, Mark }: ProductHeroProps) {
  // Landing the whole hero at once read as abrupt; a short delay then a
  // gentle fade/scale-in on just the mark (title/CTA stay static) softens
  // the arrival without holding up the text the user actually reads first.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex items-center bg-black px-[70px] pb-20 pt-5 min-[1441px]:px-[150px]">
      <div className="flex flex-col gap-10 py-[110px]">
        <div className="flex max-w-[632px] flex-col gap-0">
          <h1 className="font-display text-[80px] leading-[104px] text-white">
            {name}
          </h1>
          <p className="mt-4 font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Button>Request a Demo</Button>
        </div>
      </div>

      {/* Fills the rest of the section beside the text column, so the mark
          centers within that remaining space instead of being pinned to
          the right edge by a magic-number offset. Every ProductMark's
          scene is a fixed 280px (see product-mark.css); Figma specs
          Cobalt's at roughly 2x that, so it's scaled up with a transform
          here rather than resized directly — its layered 3D faces are
          all built from fixed-px absolute positions, not relative units,
          so they'd fall out of alignment if the box itself were just
          stretched via width/height. The rotate stays a static class;
          scale/opacity move to inline styles below since those two need
          to animate. The wrapper, not the mark itself, carries all of
          this: the mark's own product-mark-scene class sets `position:
          relative`, and since that CSS is imported after Tailwind's
          utilities, it would win any cascade tie over a positioning class
          on the same element. */}
      <div
        aria-hidden="true"
        // translate-y-[35px]: product-mark-scene's own box reserves extra
        // room below the chip for its drop shadow (see product-mark.css),
        // so centering the box puts the *chip* above the row's true
        // center — this nudges the visible chip back down to align with
        // the text column.
        className="pointer-events-none flex flex-1 translate-y-[35px] select-none items-center justify-center"
      >
        <div
          className="origin-center -rotate-[2.3deg]"
          style={{
            opacity: revealed ? 1 : 0,
            transform: `scale(${revealed ? 2 : 1.8})`,
            transition: `opacity ${REVEAL_MS}ms ${REVEAL_EASE}, transform ${REVEAL_MS}ms ${REVEAL_EASE}`,
          }}
        >
          <Mark />
        </div>
      </div>
    </section>
  );
}
