import { useEffect, useRef } from "react";
import clsx from "clsx";
import {
  CameraController,
  drawZoomScene,
  DEFAULT_CAMERA_STOPS,
  type CameraStop,
} from "../lib/product-zoom-scene";
import {
  drawNightwatchZoomScene,
  NIGHTWATCH_CAMERA_STOPS,
} from "../lib/product-zoom-scene-nightwatch";

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
export type ZoomSceneMode = "cobalt" | "nightwatch";

export interface ProductZoomSceneProps {
  activeIndex: number;
  mode?: ZoomSceneMode;
  stops?: CameraStop[];
  className?: string;
}

// Placeholder hazard readouts per stop, styled with the same glass-card/
// badge chrome ProductScene's overlays already use (see product-scene.css)
// rather than drawn on the canvas — real text is much easier to keep
// crisp and accessible as DOM than as canvas glyphs. Swap alongside
// DEFAULT_CAMERA_STOPS once real feature content is decided. Order
// matches the camera stops: global picture, regional drill-down, live
// ground footage, impact simulation.
const STOP_OVERLAYS = [
  {
    card: null,
    badge: { dot: "good" as const, text: "GLOBAL · 9 ACTIVE HAZARDS" },
  },
  {
    card: {
      title: "ERUPTIVE ACTIVITY // SECTOR 4",
      rows: [
        { label: "Alert Level", value: "ORANGE", dot: "warn" as const },
        { label: "Ash Plume", value: "4.2 KM" },
        { label: "Status", value: "MONITORING" },
      ],
    },
    badge: { dot: "crit" as const, text: "SEISMIC M4.2 · 12KM" },
    // Hung directly off the eruption's own center (which sits at this
    // stop's exact canvas center — see REGIONAL/DEFAULT_CAMERA_STOPS in
    // product-zoom-scene.ts) rather than the scene's outer corners —
    // the same "label stuck to the map, right where the event is" read
    // a real volcano-ops display's own readouts give it. This spot is
    // ~4°N, right on Mount Cameroon — too close to the equator for a
    // tropical cyclone to plausibly form (real cyclones need the
    // Coriolis effect, which is essentially zero this near the
    // equator), but it's one of Africa's genuinely active volcanoes.
    tabs: [
      { text: "VEI 3 ERUPTION", top: "calc(50% - 62px)" },
      { text: "ASH PLUME 4.2KM · 4.0°N 9.0°E", top: "calc(50% + 46px)" },
    ],
  },
  {
    card: {
      title: "GROUND FEED // SECTOR 4",
      rows: [
        { label: "Signal", value: "STRONG", dot: "good" as const },
        { label: "Feed", value: "ACTIVE", dot: "good" as const },
        { label: "Latency", value: "220 MS" },
      ],
    },
    badge: { dot: "crit" as const, text: "LIVE · GROUND CAM 04" },
  },
  {
    card: {
      title: "IMPACT SIMULATION",
      rows: [
        { label: "AOR", value: "COASTAL SECTOR" },
        { label: "Window", value: "T+0 → T+24H" },
        { label: "Asset", value: "FLAGGED", dot: "warn" as const },
      ],
    },
    badge: { dot: "warn" as const, text: "SIMULATION RUNNING" },
    // The simulation stop draws an actual bezeled monitor that fills the
    // whole frame (see drawSimulationScreen in product-zoom-scene.ts) —
    // its own inner "glass" area starts 20px in from the frame edge
    // (marginPx + bezelPx there). This card/badge need to sit inside
    // that with real padding, not at the scene's generic 16-20px outer
    // corners (which land right on the monitor's own bezel band).
    cardStyle: { left: 40, bottom: 40, width: 186 },
    badgeStyle: { top: 40, right: 40 },
  },
];

// Same glass-card/badge chrome, keyed to Nightwatch's own three pipeline
// stages instead of cobalt's map stops. Only a badge, no card, at every
// stop — the canvas composition itself (feed cards, topic chips, the
// report) is already the detailed readout here, so a duplicate glass
// card just overlaps and re-states it.
const NIGHTWATCH_STOP_OVERLAYS = [
  {
    card: null,
    badge: { dot: "good" as const, text: "4 SOURCES CONNECTED" },
  },
  {
    card: null,
    badge: { dot: "good" as const, text: "PERSONALIZED · 3 TOPICS" },
  },
  {
    card: null,
    badge: { dot: "good" as const, text: "EXPORT READY" },
  },
];

function ZoomSceneOverlay({ activeIndex, mode }: { activeIndex: number; mode: ZoomSceneMode }) {
  const overlays = mode === "nightwatch" ? NIGHTWATCH_STOP_OVERLAYS : STOP_OVERLAYS;
  return (
    <>
      {overlays.map((overlay, i) => {
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
              <div
                className="product-scene-card"
                style={{ left: 18, bottom: 16, width: 186, ...("cardStyle" in overlay ? overlay.cardStyle : null) }}
              >
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
            <div
              className="product-scene-badge"
              style={{ top: 16, right: 20, ...("badgeStyle" in overlay ? overlay.badgeStyle : null) }}
            >
              <span className={`product-scene-dot product-scene-dot-${overlay.badge.dot}`} />
              {overlay.badge.text}
            </div>
            {"tabs" in overlay &&
              overlay.tabs?.map((tab) => (
                <div className="product-scene-tab" style={{ top: tab.top }} key={tab.text}>
                  {tab.text}
                </div>
              ))}
          </div>
        );
      })}
    </>
  );
}

export function ProductZoomScene({
  activeIndex,
  mode = "cobalt",
  stops,
  className,
}: ProductZoomSceneProps) {
  const resolvedStops = stops ?? (mode === "nightwatch" ? NIGHTWATCH_CAMERA_STOPS : DEFAULT_CAMERA_STOPS);
  const draw = mode === "nightwatch" ? drawNightwatchZoomScene : drawZoomScene;
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CameraController | null>(null);
  if (!controllerRef.current) controllerRef.current = new CameraController(resolvedStops);

  useEffect(() => {
    controllerRef.current!.setStops(resolvedStops);
  }, [resolvedStops]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      controllerRef.current!.snapTo(activeIndex);
      return;
    }
    // Debounced on purpose: a fast scroll can sweep `activeIndex`
    // through every stop in between on its way to wherever it settles
    // (each one a real, if momentary, value) — reacting to every single
    // one restarts the flight mid-air toward a new target each time,
    // which reads as "zoom, shift, zoom, shift again" instead of one
    // direct move. Waiting for activeIndex to hold still for a beat
    // means only the value it actually lands on ever starts a flight.
    const timeoutId = window.setTimeout(() => {
      controllerRef.current!.setActive(activeIndex, performance.now());
    }, 90);
    return () => window.clearTimeout(timeoutId);
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

    function render(t: number) {
      const cam = controllerRef.current!.update(performance.now());
      if (logicalW && logicalH) draw(ctx!, logicalW, logicalH, t, cam, resolvedStops);
    }

    function resize() {
      const rect = frame!.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height;
      canvas!.width = Math.max(1, Math.round(logicalW * dpr));
      canvas!.height = Math.max(1, Math.round(logicalH * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(reduced ? 0 : performance.now() / 1000);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(frame);
    resize();

    let rafId = 0;
    if (!reduced) {
      const tick = (now: number) => {
        render(now / 1000);
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
    draw(ctx, rect.width, rect.height, 0, cam, resolvedStops);
  }, [activeIndex, resolvedStops, draw]);

  return (
    <div ref={frameRef} className={clsx("product-scene", className)}>
      <canvas ref={canvasRef} className="product-scene-canvas" />
      <div className="product-scene-glow" style={{ top: "-20%", left: "-5%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
      <ZoomSceneOverlay activeIndex={activeIndex} mode={mode} />
    </div>
  );
}
