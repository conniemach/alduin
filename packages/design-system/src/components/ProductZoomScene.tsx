import { useEffect, useRef } from "react";
import clsx from "clsx";
import {
  CameraController,
  drawZoomScene,
  DEFAULT_CAMERA_STOPS,
  type CameraStop,
} from "../lib/product-zoom-scene";

/**
 * Continuous camera-move counterpart to ProductScene — see
 * lib/product-zoom-scene.ts for the camera model and why this exists as
 * its own thing rather than another ProductSceneMode. `activeIndex` is
 * controlled (the caller's current slide index, e.g. Features.tsx's
 * scroll-derived stepIndex), not a scroll position — the camera sits
 * still, looping its own ambient motion, until activeIndex changes, then
 * runs one fixed-duration flight to the new stop. That decouples the
 * camera move's own feel from how fast the user happens to be
 * scrolling, matching how every other crossfade in this system already
 * behaves (fixed duration, scroll only decides *when* it fires).
 */
export interface ProductZoomSceneProps {
  activeIndex: number;
  stops?: CameraStop[];
  className?: string;
}

// Placeholder hazard readouts per stop, styled with the same glass-card/
// badge chrome ProductScene's overlays already use (see product-scene.css)
// rather than drawn on the canvas — real text is much easier to keep
// crisp and accessible as DOM than as canvas glyphs. Swap alongside
// DEFAULT_CAMERA_STOPS once real feature content is decided.
const STOP_OVERLAYS = [
  {
    card: {
      title: "STORM CELL // SECTOR 4",
      rows: [
        { label: "Category", value: "CAT 3", dot: "warn" as const },
        { label: "Wind Speed", value: "125 MPH" },
        { label: "Status", value: "MONITORING" },
      ],
    },
    badge: { dot: "crit" as const, text: "SEISMIC M4.2 · 12KM" },
  },
  {
    card: {
      title: "IMPACT CORRIDOR",
      rows: [
        { label: "AOR", value: "COASTAL SECTOR" },
        { label: "ETA", value: "18H" },
        { label: "Asset", value: "FLAGGED", dot: "warn" as const },
      ],
    },
    badge: { dot: "warn" as const, text: "EARLY WARNING · ACTIVE" },
  },
  {
    card: null,
    badge: { dot: "good" as const, text: "GLOBAL · 4 ACTIVE HAZARDS" },
  },
];

function ZoomSceneOverlay({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      {STOP_OVERLAYS.map((overlay, i) => {
        const isFront = i === activeIndex;
        return (
          <div
            key={i}
            aria-hidden={!isFront}
            className={clsx(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              isFront ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {overlay.card && (
              <div className="product-scene-card" style={{ left: 18, bottom: 16, width: 186 }}>
                <div className="product-scene-card-title">{overlay.card.title}</div>
                {overlay.card.rows.map((row) => (
                  <div className="product-scene-row" key={row.label}>
                    {row.dot && <span className={`product-scene-dot product-scene-dot-${row.dot}`} />}
                    <span className="product-scene-row-name">{row.label}</span>
                    <span className="product-scene-row-sub">{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="product-scene-badge" style={{ top: 16, right: 20 }}>
              <span className={`product-scene-dot product-scene-dot-${overlay.badge.dot}`} />
              {overlay.badge.text}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function ProductZoomScene({
  activeIndex,
  stops = DEFAULT_CAMERA_STOPS,
  className,
}: ProductZoomSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CameraController | null>(null);
  if (!controllerRef.current) controllerRef.current = new CameraController(stops);

  useEffect(() => {
    controllerRef.current!.setStops(stops);
  }, [stops]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) controllerRef.current!.snapTo(activeIndex);
    else controllerRef.current!.setActive(activeIndex, performance.now());
  }, [activeIndex]);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let logicalW = 0;
    let logicalH = 0;

    function draw(t: number) {
      const cam = controllerRef.current!.update(performance.now());
      if (logicalW && logicalH) drawZoomScene(ctx!, logicalW, logicalH, t, cam, stops);
    }

    function resize() {
      const rect = frame!.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height;
      canvas!.width = Math.max(1, Math.round(logicalW * dpr));
      canvas!.height = Math.max(1, Math.round(logicalH * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reduced ? 0 : performance.now() / 1000);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(frame);
    resize();

    let rafId = 0;
    if (!reduced) {
      const tick = (now: number) => {
        draw(now / 1000);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Under prefers-reduced-motion the rAF loop above never starts, but a
  // redraw still needs to happen whenever activeIndex changes (that's
  // the user's own scroll input, not an autoplaying animation) — the
  // camera has already snapped instantly via the effect above.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) return;
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = frame.getBoundingClientRect();
    const cam = controllerRef.current!.update(performance.now());
    drawZoomScene(ctx, rect.width, rect.height, 0, cam, stops);
  }, [activeIndex, stops]);

  return (
    <div ref={frameRef} className={clsx("product-scene", className)}>
      <canvas ref={canvasRef} className="product-scene-canvas" />
      <div className="product-scene-glow" style={{ top: "-20%", left: "-5%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
      <ZoomSceneOverlay activeIndex={activeIndex} />
    </div>
  );
}
