"use client";

import { useRef, useState, type SVGAttributes } from "react";

export interface Benefit {
  Icon: (props: SVGAttributes<SVGSVGElement> & { animate?: boolean }) => React.JSX.Element;
  label: string;
  description: string;
  // How long each icon's own icon-motion.css animation runs (see
  // BenefitsSection.tsx) — used to turn `animate` back off once it's
  // done playing so a later hover still replays fresh.
  animationMs: number;
}

export interface ProductBenefitsProps {
  headline: string;
  description: string;
  benefits: Benefit[];
}

export function ProductBenefits({
  headline,
  description,
  benefits,
}: ProductBenefitsProps) {
  const [animate, setAnimate] = useState<boolean[]>(benefits.map(() => false));
  const timeoutsRef = useRef<number[]>([]);

  const playAnimation = (i: number) => {
    setAnimate((prev) => prev.map((v, j) => (j === i ? true : v)));
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setAnimate((prev) => prev.map((v, j) => (j === i ? false : v)));
      }, benefits[i].animationMs + 50),
    );
  };

  return (
    <section className="flex flex-col gap-[50px] pb-20 pt-10">
      <div className="flex gap-12">
        {/* -mt corrects for IBM Plex Mono's taller ascent metric relative to
            42dot Sans: at equal line-heights, the mono glyphs render lower
            since more of its box is reserved above the actual ink (see
            BenefitsSection.tsx). */}
        <p className="-mt-[3.3px] flex-1 font-mono text-[32px] leading-[38.4px] text-white">
          {headline}
        </p>
        <p className="flex-1 font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {benefits.map((b, i) => (
          <div
            key={b.label}
            className="flex flex-col gap-5 pb-10 pt-10 pr-5"
            onMouseEnter={() => playAnimation(i)}
          >
            <b.Icon className="size-6 text-white" animate={animate[i]} />
            <div className="flex flex-col gap-5">
              <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
                {b.label}
              </p>
              <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
                {b.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
