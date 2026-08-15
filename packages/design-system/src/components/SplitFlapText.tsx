import { useEffect, useRef } from "react";
import clsx from "clsx";

const FLAP_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STEP_DURATION_MS = 80;

function isFlappable(ch: string) {
  return FLAP_ALPHABET.indexOf(ch.toUpperCase()) !== -1;
}

/**
 * Departure-board character flip, ported from the "Signal Over Noise"
 * hero motion study — see styles/split-flap.css for the visual
 * treatment (no boxed tiles, sized in em off the host font-size).
 * Every letter renders as its own tile immediately (the real text, via
 * `aria-label`, so screen readers and no-JS get the correct headline
 * with no dependency on the animation); each tile starts a few letters
 * back in the alphabet and flips forward to its target at its own
 * pace, so they settle asynchronously like a real board rather than
 * all landing on the same beat. The flip is gated behind an
 * IntersectionObserver rather than firing on mount — it plays once,
 * the moment the text actually scrolls into view, and never again
 * (the observer disconnects itself after the first trigger, so a
 * re-render or the element re-entering the viewport later doesn't
 * replay it). Respects prefers-reduced-motion by skipping the flip
 * entirely and leaving the resting letters in place. Non-letter
 * characters (digits, punctuation) render as plain text — only A–Z
 * has a place on the flap wheel.
 */
export interface SplitFlapTextProps {
  text: string;
  className?: string;
}

export function SplitFlapText({ text, className }: SplitFlapTextProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    function playFlip() {
      const tiles = Array.from(root!.querySelectorAll<HTMLElement>("[data-flap-tile]"));

      tiles.forEach((tile) => {
        const final = tile.dataset.final!;
        const topGlyph = tile.querySelector<HTMLElement>("[data-flap-top]")!;
        const bottomGlyph = tile.querySelector<HTMLElement>("[data-flap-bottom]")!;
        const leaf = tile.querySelector<HTMLElement>("[data-flap-leaf]")!;
        const leafGlyph = tile.querySelector<HTMLElement>("[data-flap-leaf-glyph]")!;

        const finalIndex = FLAP_ALPHABET.indexOf(final.toUpperCase());
        const distance = 3 + Math.floor(Math.random() * 9); // 3-11 steps, so tiles settle asynchronously
        const startIndex =
          (((finalIndex - distance) % FLAP_ALPHABET.length) + FLAP_ALPHABET.length) % FLAP_ALPHABET.length;
        let current = FLAP_ALPHABET[startIndex];
        let flipsLeft = distance;

        topGlyph.textContent = current;
        bottomGlyph.textContent = current;

        function runStep() {
          const nextIndex = (FLAP_ALPHABET.indexOf(current) + 1) % FLAP_ALPHABET.length;
          const toChar = FLAP_ALPHABET[nextIndex];
          const landing = flipsLeft === 1 ? final : toChar;

          leafGlyph.textContent = current;
          leaf.style.transition = "none";
          leaf.style.transform = "rotateX(0deg)";
          void leaf.offsetWidth;
          topGlyph.textContent = landing;

          requestAnimationFrame(() => {
            leaf.style.transition = `transform ${STEP_DURATION_MS}ms cubic-bezier(.5,0,.75,0)`;
            leaf.style.transform = "rotateX(-90deg)";
          });

          const id = setTimeout(() => {
            bottomGlyph.textContent = landing;
            current = toChar;
            flipsLeft--;
            if (flipsLeft > 0) runStep();
          }, STEP_DURATION_MS);
          timers.push(id);
        }
        runStep();
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        playFlip();
      },
      // rootMargin shrinks the effective viewport's bottom edge (same
      // trick ScrollReveal uses) so a fast scroll doesn't trigger the
      // flip while the text is still mostly below the fold, just
      // grazing the bottom of the window — it only counts once the
      // text is substantially inside the visible viewport.
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      timers.forEach((id) => clearTimeout(id));
    };
  }, [text]);

  return (
    <h1 ref={rootRef} className={clsx(className)} aria-label={text}>
      <span aria-hidden="true">
        {text.split("").map((ch, i) => {
          if (!isFlappable(ch)) {
            return <span key={i}>{ch === " " ? " " : ch}</span>;
          }
          return (
            <span key={i} data-flap-tile data-final={ch} className="split-flap-tile">
              <span className="split-flap-spacer">{ch}</span>
              <span className="split-flap-half split-flap-top">
                <span data-flap-top className="split-flap-glyph">
                  {ch}
                </span>
              </span>
              <span className="split-flap-half split-flap-bottom">
                <span data-flap-bottom className="split-flap-glyph">
                  {ch}
                </span>
              </span>
              <span data-flap-leaf className="split-flap-half split-flap-top split-flap-leaf">
                <span data-flap-leaf-glyph className="split-flap-glyph">
                  {ch}
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
