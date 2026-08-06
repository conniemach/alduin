"use client";

import { useState } from "react";
import { Tab } from "@alduin/design-system";

// Same crossfade duration/easing Features.tsx uses for its slide
// transitions (motion.featureCrossfade) — kept as a literal here since
// that token lives in the design-system package and this is a one-off,
// site-only toggle, not a reusable component.
const CROSSFADE_MS = 1200;
const CROSSFADE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Scattered, low-opacity mono labels standing in for "critical
// information scattered across multiple applications" — literally
// visualizes the copy's complaint rather than just stating it. Purely
// decorative (aria-hidden), positions/rotations are hand-picked to
// avoid the copy column rather than computed.
const CLUTTER_TAGS = [
  { text: "TAB_14", top: "4%", left: "2%", rotate: -8 },
  { text: "APP_B", top: "88%", left: "3%", rotate: 6 },
  { text: "WIN_23", top: "10%", left: "84%", rotate: 5 },
  { text: "LOG//042", top: "80%", left: "80%", rotate: -4 },
  { text: "QUEUE_9", top: "45%", left: "92%", rotate: 10 },
  { text: "MODULE.7", top: "94%", left: "42%", rotate: -6 },
];

function ClutterField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      <div
        className="absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)",
        }}
      />
      {CLUTTER_TAGS.map((t) => (
        <span
          key={t.text}
          className="absolute whitespace-nowrap font-mono text-[11px] text-neutral-500/40"
          style={{ top: t.top, left: t.left, transform: `rotate(${t.rotate}deg)` }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}

/**
 * A tab-driven crossfade between "The Problem" and "Our Philosophy" —
 * rather than just listing both as static copy blocks, the toggle lets
 * the visual treatment itself argue the point: the Problem panel is
 * cluttered with scanline noise and scattered app/tab labels, the
 * Philosophy panel is calm and empty behind the text. Both panels are
 * stacked in the same grid cell (col-start-1/row-start-1) so the
 * container sizes to the taller one and swapping tabs never jumps the
 * page — no JS height measurement needed.
 */
export function ProblemPhilosophy() {
  const [tab, setTab] = useState<"problem" | "philosophy">("problem");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-6">
        <Tab active={tab === "problem"} onClick={() => setTab("problem")}>
          The Problem
        </Tab>
        <Tab active={tab === "philosophy"} onClick={() => setTab("philosophy")}>
          Our Philosophy
        </Tab>
      </div>

      <div className="relative grid">
        <div
          aria-hidden={tab !== "problem"}
          className="relative col-start-1 row-start-1 min-h-[220px] overflow-hidden"
          style={{
            opacity: tab === "problem" ? 1 : 0,
            pointerEvents: tab === "problem" ? "auto" : "none",
            transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE}`,
          }}
        >
          <ClutterField />
          <div className="relative flex max-w-[680px] flex-col gap-6 py-2">
            <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
              Like many operators, we relied on platforms that were
              expensive, slow, and visually cluttered—built around the
              assumptions of software developers rather than the
              realities of operational work. Critical information was
              scattered across multiple applications, simple tasks
              required unnecessary effort, and many systems felt years
              behind the environments they were supposed to support.
            </p>
            <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
              We believed there was a better way—so we built it.
            </p>
          </div>
        </div>

        <div
          aria-hidden={tab !== "philosophy"}
          className="relative col-start-1 row-start-1 min-h-[220px]"
          style={{
            opacity: tab === "philosophy" ? 1 : 0,
            pointerEvents: tab === "philosophy" ? "auto" : "none",
            transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE}`,
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-16 -inset-y-16 animate-pulse rounded-full bg-white/[0.03] blur-3xl"
          />
          <div className="relative flex max-w-[680px] flex-col gap-5 py-2">
            <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
              Operational software should help people think clearly
              under pressure. It should reduce cognitive load instead of
              adding to it, and present information with purpose rather
              than burying it beneath unnecessary menus, dashboards, or
              visual noise.
            </p>
            <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-neutral-300">
              We also believe operational software doesn&rsquo;t have to
              look like it was designed decades ago. A clean, modern
              interface isn&rsquo;t about aesthetics alone—it improves
              readability, reduces fatigue, and helps users process
              information faster when every second matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
