"use client";

import { useState } from "react";

// Quick opacity swap, not a slow narrative crossfade (this replaced the
// old tab-toggle crossfade) — snappy enough to read as a direct response
// to the pointer.
const HOVER_MS = 300;
const HOVER_EASE = "ease-out";

// Same card treatment as DemoForm's form container (and its "message
// sent" state) — rounded-[20px] + hairline border — so these two blocks
// read as the same "card" primitive used elsewhere on the site.
const CARD_CLASSNAME = "relative overflow-hidden rounded-[20px] border border-white/15 p-6";

/**
 * "The Problem" and "Our Solution", stacked full-width in matching
 * cards. Hovering a card brings it to full opacity and dims the other
 * to 75%, defaulting back to the Problem card emphasized when the
 * pointer isn't over either.
 */
export function ProblemPhilosophy() {
  const [hovered, setHovered] = useState<"problem" | "solution">("problem");

  return (
    <div className="flex flex-col gap-6" onMouseLeave={() => setHovered("problem")}>
      <div
        onMouseEnter={() => setHovered("problem")}
        className={CARD_CLASSNAME}
        style={{
          opacity: hovered === "problem" ? 1 : 0.75,
          transition: `opacity ${HOVER_MS}ms ${HOVER_EASE}`,
        }}
      >
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[12px] tracking-[0.08em] text-neutral-500">
            THE PROBLEM
          </span>
          <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
            Like many operators, we relied on platforms that were
            expensive, slow, and visually cluttered—built around the
            assumptions of software developers rather than the
            realities of operational work. Critical information was
            scattered across multiple applications, simple tasks
            required unnecessary effort, and many systems felt years
            behind the environments they were supposed to support.
          </p>
        </div>
      </div>

      <div
        onMouseEnter={() => setHovered("solution")}
        className={CARD_CLASSNAME}
        style={{
          opacity: hovered === "solution" ? 1 : 0.75,
          transition: `opacity ${HOVER_MS}ms ${HOVER_EASE}`,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 -inset-y-16 animate-pulse rounded-full bg-white/[0.03] blur-3xl"
        />
        <div className="relative flex flex-col gap-4">
          <span className="font-mono text-[12px] tracking-[0.08em] text-neutral-500">
            OUR SOLUTION
          </span>
          <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
            Operational software should help people think clearly under
            pressure by reducing cognitive load, presenting critical
            information with purpose rather than burying it beneath
            unnecessary menus, dashboards, or visual noise. A clean,
            modern interface isn&rsquo;t just about aesthetics—it
            improves readability, reduces fatigue, and empowers users to
            process information faster when every second matters.
          </p>
        </div>
      </div>
    </div>
  );
}
