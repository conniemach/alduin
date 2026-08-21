/**
 * Camera-driven "one continuous map" scene for Features' scroll-pinned
 * stage — an alternative to ProductScene's per-slide crossfade, for when
 * a section's whole story IS the camera move: zoomed into one hazard's
 * local detail, pulled back to see the global picture, zoomed into the
 * next one. A crossfade between two independently-composed scenes can't
 * sell that — their content doesn't line up frame to frame, so it reads
 * as a cut dressed up with opacity. This instead draws every point of
 * interest on ONE shared world-space canvas and moves a single camera
 * (pan + zoom) across it — the same map the whole time, never swapped
 * out.
 *
 * Deliberately NOT the calm "opacity only, no scale" rule the rest of
 * this system holds to for discrete content swaps (see Features.tsx,
 * ProblemSolutionScroll) — that rule is about not layering motion onto
 * something that's fundamentally a cut between unrelated content. This
 * isn't a cut; scale IS the content here, the same way it would be
 * scrubbing a real map.
 *
 * The camera is event-driven, not scroll-scrubbed: it sits still at the
 * active stop — looping its own ambient motion (radar sweep, storm
 * pulse) via `t` — until `CameraController.setActive` is told the
 * active slide changed, at which point it runs ONE fixed-duration flight
 * to the new stop and then settles again. Scrolling faster or slower
 * doesn't change how the camera move itself feels, only when it starts —
 * same relationship the rest of this system's crossfades already have
 * to scroll speed.
 *
 * Placeholder content: the two "local" points of interest below reuse
 * the compositions from the `cobalt` and `cobalt-corridor` ProductScene
 * modes so this is demonstrable today, before final feature call-outs
 * are decided. Swap DEFAULT_CAMERA_STOPS and the two draw*() functions
 * once they are — the camera math doesn't care what's actually drawn at
 * each stop, only where it is and how zoomed in.
 */
import {
  TAU,
  lerp,
  clamp01,
  glowDot,
  dashedPolygon,
  pingRings,
  compassRose,
  radarCell,
  type Point,
} from "./product-scene-draw";

export interface CameraStop {
  x: number;
  y: number;
  zoom: number;
  label: string;
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  label: string;
}

// World-space extent every stop's x/y lives in — arbitrary units, not
// pixels; the camera transform below maps this to the canvas at
// whatever zoom is currently active.
const WORLD_W = 2000;
const WORLD_H = 1100;

// One stop per feature slide, in the same order. The first two reuse
// `cobalt`/`cobalt-corridor`'s compositions (see drawSectorWest/
// drawCorridorEast below); the third has no composition of its own —
// zoom < 1.5 skips per-stop detail entirely (see drawZoomScene) — it's
// just the pulled-all-the-way-back view where every stop and every
// ambient blip is visible as a plain marker at once.
export const DEFAULT_CAMERA_STOPS: CameraStop[] = [
  { x: 520, y: 380, zoom: 3.2, label: "SECTOR 4 · LOCAL DETAIL" },
  { x: 1460, y: 700, zoom: 3.0, label: "COASTAL AOR · IMPACT CORRIDOR" },
  { x: 990, y: 520, zoom: 0.82, label: "GLOBAL · ALL ACTIVE HAZARDS" },
];

// How long a camera flight between two stops takes, and how far its
// midpoint zooms out relative to the two endpoints (0 = flat pan/zoom,
// 1 = zoom out to nothing) — 0.55 reads as "pull back to get your
// bearings, then move to the next point," not a cross-dissolve wearing
// a zoom costume.
const TRANSITION_MS = 1800;
const PULLBACK = 0.55;

function smoothstep(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * Owns the camera's rest/in-flight state across renders. `setActive`
 * is cheap to call every render (it no-ops unless the index actually
 * changed) — call it with the current slide index each frame or on
 * each prop change, and call `update(now)` once per animation frame to
 * get the camera to draw with. Framework-agnostic on purpose: React
 * just holds one instance in a ref (see components/ProductZoomScene.tsx).
 */
export class CameraController {
  private stops: CameraStop[];
  private activeIndex = 0;
  private from: CameraState;
  private to: CameraState;
  private current: CameraState;
  private animStart = 0;
  private animating = false;

  constructor(stops: CameraStop[]) {
    this.stops = stops;
    const s0 = stops[0] ?? { x: 0, y: 0, zoom: 1, label: "" };
    this.from = { ...s0 };
    this.to = { ...s0 };
    this.current = { ...s0 };
  }

  setStops(stops: CameraStop[]) {
    this.stops = stops;
  }

  /** Instantly snaps to a stop with no flight — for prefers-reduced-motion. */
  snapTo(index: number) {
    const clamped = Math.min(this.stops.length - 1, Math.max(0, index));
    this.activeIndex = clamped;
    const target = this.stops[clamped]!;
    this.from = { ...target };
    this.to = { ...target };
    this.current = { ...target };
    this.animating = false;
  }

  setActive(index: number, now: number) {
    const clamped = Math.min(this.stops.length - 1, Math.max(0, index));
    if (clamped === this.activeIndex) return;
    this.activeIndex = clamped;
    this.from = { ...this.current };
    this.to = { ...this.stops[clamped]! };
    this.animStart = now;
    this.animating = true;
  }

  update(now: number): CameraState {
    if (!this.animating) return this.current;
    const elapsed = now - this.animStart;
    if (elapsed >= TRANSITION_MS) {
      this.current = { ...this.to };
      this.animating = false;
      return this.current;
    }
    const moveT = smoothstep(elapsed / TRANSITION_MS);
    const pullback = Math.sin(moveT * Math.PI) * PULLBACK;
    const zoomLerp = lerp(this.from.zoom, this.to.zoom, moveT);
    this.current = {
      x: lerp(this.from.x, this.to.x, moveT),
      y: lerp(this.from.y, this.to.y, moveT),
      zoom: zoomLerp * (1 - pullback),
      label: moveT < 0.5 ? this.from.label : this.to.label,
    };
    return this.current;
  }
}

// ---- world texture: a loose coastline so pan/zoom reads as flying over
// real terrain, not shapes floating in a grid. Not a real place — a
// handful of wavy contour lines in the same style `cobalt`'s ambient
// terrain lines already use, just drawn once in world space so they
// pan/zoom with the camera instead of drifting under it.

function drawTerrain(ctx: CanvasRenderingContext2D, t: number, zoom: number) {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1 / zoom;
  for (let x = 0; x <= WORLD_W; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD_H);
    ctx.stroke();
  }
  for (let y = 0; y <= WORLD_H; y += 100) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_W, y);
    ctx.stroke();
  }

  for (let c = 0; c < 5; c++) {
    ctx.beginPath();
    for (let x = 0; x <= WORLD_W; x += 20) {
      const y =
        WORLD_H * (0.1 + c * 0.2) +
        Math.sin(x * 0.006 + c * 2.1 + t * 0.05) * 60 +
        Math.sin(x * 0.02 + c) * 18;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255,255,255,${0.09 - c * 0.008})`;
    ctx.lineWidth = 1.1 / zoom;
    ctx.stroke();
  }
}

// ---- placeholder local point-of-interest compositions ----

function drawSectorWest(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const cx = 520;
  const cy = 380;
  const aor: Point[] = [
    { x: cx - 210, y: cy - 140 },
    { x: cx + 70, y: cy - 190 },
    { x: cx + 190, y: cy + 40 },
    { x: cx + 40, y: cy + 190 },
    { x: cx - 190, y: cy + 110 },
  ];
  dashedPolygon(ctx, aor, 0.3);

  // Forecast track behind the storm, same hour-marker treatment as
  // corridorEast — the thing an operator would actually be reading.
  const track: Point[] = [0, 1, 2, 3].map((i) => {
    const s = i / 3;
    return {
      x: lerp(cx - 250, cx, s),
      y: lerp(cy - 220, cy, s) + Math.sin(s * 2.2) * 30,
    };
  });
  ctx.setLineDash([2, 4]);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  track.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 3; i++) {
    const a = t * 0.15 + i * 2.4;
    radarCell(ctx, cx + Math.cos(a) * 10, cy + Math.sin(a) * 10, 15 + i * 5, t, i * 1.7);
  }
  const sweep = (t * 0.4) % TAU;
  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, 44, sweep, sweep + 0.55);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, TAU);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const seismic = { x: cx + 150, y: cy - 100 };
  pingRings(ctx, seismic.x, seismic.y, t, 2.4, 46, "196,106,94", 2);
  glowDot(ctx, seismic.x, seismic.y, 6, 0.6, "196,106,94");

  const volcano = { x: cx + 220, y: cy + 60 };
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(volcano.x, volcano.y - 16);
  ctx.lineTo(volcano.x + 14, volcano.y + 10);
  ctx.lineTo(volcano.x - 14, volcano.y + 10);
  ctx.closePath();
  ctx.stroke();
  glowDot(ctx, volcano.x, volcano.y - 16, 6 + Math.sin(t * 2) * 2, 0.5, "230,140,80");

  const infra: Point[] = [
    { x: cx + 30, y: cy + 100 },
    { x: cx + 120, y: cy + 40 },
    { x: cx + 10, y: cy - 20 },
  ];
  for (let n = 0; n < infra.length; n++) {
    const node = infra[n]!;
    if (n > 0) {
      const prev = infra[n - 1]!;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(node.x - 3.5, node.y - 3.5, 7, 7);
  }
  ctx.restore();
}

function drawCorridorEast(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const storm = { x: 1330, y: 700 };
  const aor: Point[] = [
    { x: 1620, y: 560 },
    { x: 1880, y: 610 },
    { x: 1830, y: 800 },
    { x: 1660, y: 850 },
    { x: 1560, y: 730 },
  ];
  const centroid = aor.reduce(
    (acc, p) => ({ x: acc.x + p.x / aor.length, y: acc.y + p.y / aor.length }),
    { x: 0, y: 0 },
  );
  const angle = Math.atan2(centroid.y - storm.y, centroid.x - storm.x);
  const len = Math.hypot(centroid.x - storm.x, centroid.y - storm.y) * 1.25;
  const spread = 0.34;
  const breathe = 0.55 + 0.25 * Math.sin(t * (TAU / 2.4));

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(storm.x, storm.y);
  ctx.arc(storm.x, storm.y, len, angle - spread, angle + spread);
  ctx.closePath();
  ctx.clip();
  const grad = ctx.createRadialGradient(storm.x, storm.y, 0, storm.x, storm.y, len);
  grad.addColorStop(0, `rgba(255,255,255,${0.18 * breathe})`);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(storm.x - len, storm.y - len, len * 2, len * 2);
  ctx.restore();

  dashedPolygon(ctx, aor, 0.3);

  const track: Point[] = [0, 1, 2, 3].map((i) => {
    const s = i / 3;
    return {
      x: lerp(storm.x - 260, storm.x, s),
      y: lerp(storm.y + 180, storm.y, s) + Math.sin(s * 2.6) * 40,
    };
  });
  ctx.setLineDash([2, 4]);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  track.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 3; i++) {
    const a = t * 0.15 + i * 2.4;
    radarCell(ctx, storm.x + Math.cos(a) * 8, storm.y + Math.sin(a) * 8, 13 + i * 4, t, i * 1.7);
  }

  const infra = { x: lerp(storm.x, centroid.x, 0.78), y: lerp(storm.y, centroid.y, 0.78) };
  const pulse = 0.5 + 0.5 * Math.sin(t * (TAU / 1.6));
  glowDot(ctx, infra.x, infra.y, 7 + pulse * 2, 0.5, "207,159,82");
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(infra.x - 3.5, infra.y - 3.5, 7, 7);
  ctx.restore();
}

// Small unlabeled hazard blips scattered around the world purely so the
// pulled-back global stop reads as "a live network," not two empty dots
// on a blank map.
const AMBIENT_BLIPS: { x: number; y: number; color: string }[] = [
  { x: 260, y: 860, color: "111,174,130" },
  { x: 1780, y: 260, color: "207,159,82" },
  { x: 980, y: 120, color: "111,174,130" },
  { x: 1750, y: 950, color: "196,106,94" },
];

export function drawZoomScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  cam: CameraState,
  stops: CameraStop[],
) {
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);

  drawTerrain(ctx, t, cam.zoom);

  // Each stop's detail fades in as the camera's live zoom approaches
  // that stop's own target zoom, and fades to a plain pulsing dot once
  // the camera pulls back past it — the same level-of-detail idea a
  // real map applies between building outlines and place markers.
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    if (stop.zoom < 1.5) continue; // the pulled-back "global" stop has no composition of its own
    const detail = clamp01((cam.zoom - stop.zoom * 0.4) / (stop.zoom * 0.45));
    if (i === 0) drawSectorWest(ctx, t, detail);
    if (i === 1) drawCorridorEast(ctx, t, detail);
    if (detail < 0.94) {
      glowDot(ctx, stop.x, stop.y, 10, 0.35 * (1 - detail), "255,255,255");
      pingRings(ctx, stop.x, stop.y, t, 2.8, 24, "255,255,255", 2);
    }
  }

  for (const blip of AMBIENT_BLIPS) {
    glowDot(ctx, blip.x, blip.y, 8, 0.4, blip.color);
    pingRings(ctx, blip.x, blip.y, t, 3.2, 20, blip.color, 2);
  }

  ctx.restore();

  // Compass stays screen-anchored, like a fixed instrument overlay — it
  // shouldn't zoom with the map.
  compassRose(ctx, w - 34, h - 40, 13);
}
