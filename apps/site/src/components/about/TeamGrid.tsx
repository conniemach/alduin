"use client";

import { useRef, useState, type SVGAttributes } from "react";

export interface TeamGridItem {
  Icon: (props: SVGAttributes<SVGSVGElement> & { animate?: boolean }) => React.JSX.Element;
  label: string;
  description: string;
  // How long each icon's own icon-motion.css animation runs (see
  // BenefitsSection.tsx/ProductBenefits.tsx) — used to turn `animate`
  // back off once it's done playing so a later hover still replays fresh.
  animationMs: number;
}

// Just the interactive icon grid half of ProductBenefits, without its
// baked-in two-column headline/description row — About's own
// SectionIntro handles that instead, so every section on the page
// shares one intro layout rather than each grid bringing its own.
export function TeamGrid({ items }: { items: TeamGridItem[] }) {
  const [animate, setAnimate] = useState<boolean[]>(items.map(() => false));
  const timeoutsRef = useRef<number[]>([]);

  const playAnimation = (i: number) => {
    setAnimate((prev) => prev.map((v, j) => (j === i ? true : v)));
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setAnimate((prev) => prev.map((v, j) => (j === i ? false : v)));
      }, items[i].animationMs + 50),
    );
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="flex flex-col gap-5 pb-10 pt-10 pr-5"
          onMouseEnter={() => playAnimation(i)}
        >
          <item.Icon className="size-6 text-white" animate={animate[i]} />
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
              {item.label}
            </p>
            <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
