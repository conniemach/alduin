"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const EXIT_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// Softer than EXIT_EASE: a gentler initial ramp (no quick snap at the
// start) for a calmer entrance — the same "Gentle" curve this system
// already uses for its slow button hovers (tokens/motion.ts).
const ENTER_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ENTER_MS = 1800;
const ENTER_DELAY_MS = 120;
const EXIT_MS = 300;
const EXIT_DELAY_MS = 0;

/**
 * Fades a section in as it scrolls into view and back out as it scrolls
 * past, with a slower/delayed entrance and a snappier, immediate exit —
 * toggles every time the element crosses the viewport, not just once.
 */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Shrinks the effective viewport's bottom edge so a section barely
      // grazing the fold (e.g. one sitting just below the Hero) doesn't
      // register as "in view" on initial load, before the user has
      // actually scrolled to it.
      { threshold: 0.15, rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transition: visible
          ? `opacity ${ENTER_MS}ms ${ENTER_EASE} ${ENTER_DELAY_MS}ms`
          : `opacity ${EXIT_MS}ms ${EXIT_EASE} ${EXIT_DELAY_MS}ms`,
      }}
    >
      {children}
    </div>
  );
}
