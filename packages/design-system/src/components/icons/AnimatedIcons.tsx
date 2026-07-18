import { useId, type SVGAttributes } from "react";

/**
 * Bespoke hover-animated variants of a handful of icons (check, chart,
 * account, earth). These are hand-built as multi-part, stroke-friendly
 * SVGs rather than data-driven off the single-path `paths` registry in
 * Icon.tsx, since the animations need separate strokeable/poppable
 * pieces (a line vs. its dots, a person vs. its arcs) that the plain
 * filled Figma export doesn't have.
 *
 * At rest every icon renders fully visible/complete, matching its Icon.tsx
 * counterpart. Hovering replays a short "being drawn" entrance — see
 * styles/icon-motion.css for the actual keyframes; each icon here just
 * wires up the class names and per-part structure those keyframes target.
 * Requires icon-motion.css to be imported by the consuming app.
 */
type AnimatedIconProps = SVGAttributes<SVGSVGElement>;

export function CheckDrawIcon({ className, ...props }: AnimatedIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`icon-check-draw ${className ?? ""}`}
      {...props}
    >
      <path
        d="M2.5 8.7L6 12.2L13.5 4.3"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
    </svg>
  );
}

const CHART_POINTS = [
  { x: 1.5, y: 12 },
  { x: 5.5, y: 7 },
  { x: 9, y: 9.5 },
  { x: 14.5, y: 3.5 },
];

export function ChartDrawIcon({ className, ...props }: AnimatedIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`icon-chart-draw ${className ?? ""}`}
      {...props}
    >
      <path
        className="chart-line"
        d={`M${CHART_POINTS.map((p) => `${p.x} ${p.y}`).join(" L")}`}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
      {CHART_POINTS.map((p, i) => (
        <circle
          key={i}
          className={`chart-dot chart-dot-${i + 1}`}
          cx={p.x}
          cy={p.y}
          r={1.1}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function AccountPulseIcon({ className, ...props }: AnimatedIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`icon-account-pulse ${className ?? ""}`}
      {...props}
    >
      <path
        className="account-person"
        fill="currentColor"
        d="M6.00001 3.33337C6.70725 3.61433 7.38553 3.61433 7.88562 4.11442C8.38572 4.61452 8.66667 5.2928 8.66667 6.00004C8.66667 6.70728 8.38572 7.38556 7.88562 7.88566C7.38553 8.38576 6.70725 8.66671 6.00001 8.66671C5.29276 8.66671 4.61448 8.38576 4.11439 7.88566C3.61429 7.38556 3.33334 6.70728 3.33334 6.00004C3.33334 5.2928 3.61429 4.61452 4.11439 4.11442C4.61448 3.61433 5.29276 3.33337 6.00001 3.33337ZM6.00001 10C7.78001 10 11.3333 10.8934 11.3333 12.6667V14H0.666672V12.6667C0.666672 10.8934 4.22001 10 6.00001 10Z"
      />
      <path
        className="account-arc account-arc-sm"
        fill="currentColor"
        d="M11.1733 3.57337C12.52 5.04004 12.52 7.07337 11.1733 8.42004L10.0533 7.29337C10.6133 6.50671 10.6133 5.48671 10.0533 4.70004L11.1733 3.57337Z"
      />
      <path
        className="account-arc account-arc-lg"
        fill="currentColor"
        d="M13.38 1.33337C16 4.03337 15.98 8.07337 13.38 10.6667L12.2933 9.58004C14.14 7.46004 14.14 4.43337 12.2933 2.42004L13.38 1.33337Z"
      />
    </svg>
  );
}

// Two landmasses, hand-drawn rather than reusing the original glyph's
// swooshes (which only read as "continents" when combined with the ring
// via SVG's winding-rule cancellation — as plain solid fills on their
// own they're one oversized blob, not distinct land). Each one's outer
// corner deliberately reaches past the clip circle's radius (5.9, which
// matches the ring's own inner edge — see the ring's r/strokeWidth
// below) so it touches the ring with no gap, reading as land meeting
// the horizon rather than an island floating in open water. The clip
// radius stops exactly at that inner edge rather than the ring's
// center or outer edge, so the fill sits flush against the ring without
// ever bleeding into the stroke itself.
const EARTH_CONTINENTS = [
  "M8 3L11.5 2.8L13.3 5L12 8L9.5 8.3L8.5 6Z",
  "M4.5 8.5L6.5 8L7.3 10.5L6 13.2L3.3 12.8L2.7 10Z",
];

function EarthContinents({ offset }: { offset: number }) {
  return (
    <g style={{ transform: `translateX(${offset}px)` }}>
      {EARTH_CONTINENTS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </g>
  );
}

/**
 * The outer ring is a plain static stroke circle — it never moves, same
 * as the original glyph's silhouette wouldn't change as a real globe
 * spins. The continents underneath are clipped to that same circle and,
 * on hover, slide left in a continuously looping, linear scroll for as
 * long as the pointer stays over the icon; un-hovering just stops the
 * scroll (see icon-motion.css) rather than easing back, matching a real
 * globe you've stopped spinning wherever it happens to be. Two copies of
 * the continents are stamped side by side (0 and +16, one full viewBox
 * width apart) so the loop has no visible seam.
 */
export function EarthSpinIcon({ className, ...props }: AnimatedIconProps) {
  const clipId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`icon-earth-spin ${className ?? ""}`}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="8" cy="8" r="5.9" />
        </clipPath>
      </defs>
      {/* The clip lives on this outer, never-transformed group, so the
          circular "window" stays fixed in place. The animation below
          only ever moves the inner group — if it moved this one instead,
          the window would slide along with the content and stop
          clipping anything, letting land visibly spill outside the ring
          mid-scroll. */}
      <g clipPath={`url(#${clipId})`}>
        <g className="earth-surface">
          <EarthContinents offset={0} />
          <EarthContinents offset={16} />
        </g>
      </g>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth={1.1} />
    </svg>
  );
}
