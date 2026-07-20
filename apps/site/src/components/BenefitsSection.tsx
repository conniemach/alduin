"use client";

import { useEffect, useRef, useState, type SVGAttributes } from "react";
import {
  CheckDrawIcon,
  ChartDrawIcon,
  AccountPulseIcon,
  EarthSpinIcon,
} from "@alduin/design-system";

const benefits: {
  Icon: (props: SVGAttributes<SVGSVGElement> & { animate?: boolean }) => React.JSX.Element;
  label: string;
  description: string;
  // How long each icon's own icon-motion.css animation runs, so its
  // `animate` class can be turned back off once it's done playing —
  // needed so a later hover still replays fresh instead of no-op-ing
  // against a class that never got removed.
  animationMs: number;
}[] = [
  {
    Icon: CheckDrawIcon,
    label: "PREDICT",
    description:
      "Model tsunamis, eruptions, and hurricanes — then auto-generate impact projections across infrastructure, populations, and critical assets.",
    animationMs: 500,
  },
  {
    Icon: ChartDrawIcon,
    label: "TRACK",
    description:
      "Full incident lifecycle visibility, from escalation to resolution, with ownership, updates, and a timeline built for review.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "RESPOND",
    description:
      "Coordinate response and SAR planning with shared context, decision logs, and clear task routing to the field.",
    animationMs: 680,
  },
  {
    Icon: EarthSpinIcon,
    label: "COMMAND",
    description:
      "Structured briefings and posture tracking that keep every stakeholder aligned on one operational picture.",
    animationMs: 2200,
  },
];

const STAGGER_MS = 150;

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState<boolean[]>(benefits.map(() => false));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const timeouts: number[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        benefits.forEach((b, i) => {
          const start = i * STAGGER_MS;
          timeouts.push(
            window.setTimeout(() => {
              setAnimate((prev) => prev.map((v, j) => (j === i ? true : v)));
            }, start),
          );
          timeouts.push(
            window.setTimeout(
              () => {
                setAnimate((prev) => prev.map((v, j) => (j === i ? false : v)));
              },
              start + b.animationMs + 50,
            ),
          );
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <section ref={sectionRef} className="flex flex-col gap-[50px] pb-20 pt-10">
      <div className="flex gap-12">
        <p className="flex-1 font-mono text-[32px] leading-[38.4px] text-white">
          Modern intelligence capability at a fraction of legacy platform
          cost.
        </p>
        <p className="flex-1 font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
          Alduin supports teams operating in fast-changing environments
          where timing, clarity, and consequence matter. From natural
          hazard modeling to field response coordination, the platform is
          designed to move organizations from uncertainty to action.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {benefits.map((b, i) => (
          <div key={b.label} className="flex flex-col gap-5 pb-10 pt-10 pr-5">
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
