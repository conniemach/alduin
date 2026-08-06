"use client";

import { useEffect, useRef, useState } from "react";

const OPERATORS = [
  "Intelligence analysts",
  "GSOC operators",
  "Investigators",
  "Emergency managers",
  "Security professionals",
];

const FOCUS_AREAS = [
  "Monitoring severe weather",
  "Tracking geopolitical developments",
  "Managing investigations",
  "Producing intelligence briefings",
  "Coordinating crisis response",
];

const HOLD_MS = 2600;
const FADE_MS = 500;

/**
 * Cycles through `items` one at a time (fade out, swap, fade in),
 * pausing entirely while `paused` is true. `offsetMs` staggers two
 * instances running side by side so they don't flip in lockstep — see
 * RoleTicker below, which reads less like a synced pair of dropdowns
 * and more like two independent live feeds.
 */
function useCycle(items: string[], offsetMs: number, paused: boolean) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    function schedule(delay: number) {
      const outId = window.setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        const inId = window.setTimeout(() => {
          if (cancelled) return;
          setIndex((i) => (i + 1) % items.length);
          setVisible(true);
          schedule(HOLD_MS);
        }, FADE_MS);
        timeoutsRef.current.push(inId);
      }, delay);
      timeoutsRef.current.push(outId);
    }
    schedule(HOLD_MS + offsetMs);

    return () => {
      cancelled = true;
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [items, offsetMs, paused]);

  return { current: items[index], visible };
}

/**
 * Reads as a small live ops feed rather than a static list, echoing
 * the copy's own "deliver the right information at the right time"
 * line: who Alduin is built for and what they're doing cycle
 * independently, staggered so they never flip on the same beat.
 * Hovering pauses both. The animated pair is aria-hidden with a plain
 * sr-only list of every item
 * alongside it, so screen readers and no-JS get the full content with
 * no dependency on the interval ever firing.
 */
export function RoleTicker() {
  const [paused, setPaused] = useState(false);
  const operator = useCycle(OPERATORS, 0, paused);
  const focus = useCycle(FOCUS_AREAS, 1300, paused);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8"
    >
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[12px] tracking-[0.08em] text-neutral-500">
          WHO WE BUILD FOR
        </span>
        <p
          aria-hidden="true"
          className="font-mono text-[20px] leading-[1.2] text-white"
          style={{
            opacity: operator.visible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-out`,
          }}
        >
          {operator.current}
        </p>
        <ul className="sr-only">
          {OPERATORS.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[12px] tracking-[0.08em] text-neutral-500">
          WHAT THEY&rsquo;RE DOING
        </span>
        <p
          aria-hidden="true"
          className="font-mono text-[20px] leading-[1.2] text-white"
          style={{
            opacity: focus.visible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-out`,
          }}
        >
          {focus.current}
        </p>
        <ul className="sr-only">
          {FOCUS_AREAS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
