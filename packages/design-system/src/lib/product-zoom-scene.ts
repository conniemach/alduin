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
 * Four stops, one story: pulled-back global picture, zoom/click into a
 * region's local detail (reusing the original `cobalt` ProductScene
 * composition), push in further to that region's live ground footage,
 * then hold on that same spot while a computer screen showing a
 * physics-based impact simulation switches on over the map (see
 * drawSimulationScreen). The camera math doesn't care what's actually
 * drawn at each stop, only where it is and how zoomed in — swap
 * DEFAULT_CAMERA_STOPS and the draw*() functions independently of it.
 */
import {
  TAU,
  lerp,
  clamp01,
  glowDot,
  pingRings,
  compassRose,
  type Point,
} from "./product-scene-draw";
import continentOutlineData from "./continent-outlines.json";

export interface CameraStop {
  x: number;
  y: number;
  zoom: number;
  label: string;
  // Skips the "pull back to get your bearings" dip on the flight INTO
  // this stop — a flat, monotonic pan+zoom straight to the target
  // instead. Most transitions in this scene want the dip (it's the
  // thing that keeps a big pull-back-then-in from feeling like a jump
  // cut), but a direct zoom/click into a region should read as exactly
  // that: zooming straight in, not overshooting out and back.
  directZoom?: boolean;
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  label: string;
  // 0 at the start of a camera flight, 1 once it's settled at rest.
  // Exists so a stop-specific overlay (the live-footage popup, the
  // simulation screen) can fade in/out relative to a single flight's own
  // progress, without needing its own separate animation clock — see
  // drawZoomScene.
  settled: number;
  // The stop this flight started FROM and is heading TO — held constant
  // for the whole flight (unlike `label`, which switches from one to the
  // other partway through so the DOM overlay/heading crossfades at a
  // sensible point). Lets a stop-specific reveal tell "arriving at me"
  // apart from "departing me," e.g. the live-footage popup fading OUT
  // over a flight's first half when `fromLabel` was its own stop, and
  // the simulation screen fading IN over a flight's second half when
  // `toLabel` is its own stop — a single continuous handoff between the
  // two instead of one cutting out before the other fades in.
  fromLabel: string;
  toLabel: string;
}

// World-space extent every stop's x/y lives in — not arbitrary units
// this time: it's a real equirectangular projection of the whole globe
// (see project() below), so pan/zoom is a genuine zoom into an actual
// map, the same coastline dataset and projection style as the About
// page hero (see apps/site/.../useGroundedMap.ts). WORLD_H is derived
// from WORLD_W so the map's true aspect ratio (~2.61:1) isn't distorted.
const WORLD_W = 2000;
type LonLat = [number, number];
const coastlines: LonLat[][] = Object.values(continentOutlineData as unknown as Record<string, LonLat[]>);

// Same latitude trim the About hero uses — drops Antarctica's long
// pointed tail and the mostly-empty Arctic past Greenland.
const LON0 = -180;
const LON1 = 180;
const LAT0 = -58;
const LAT1 = 80;
const LON_RANGE = LON1 - LON0;
const LAT_RANGE = LAT1 - LAT0;
const WORLD_H = Math.round(WORLD_W / (LON_RANGE / LAT_RANGE));

function project(lon: number, lat: number): Point {
  const u = (lon - LON0) / LON_RANGE;
  const v = 1 - (lat - LAT0) / LAT_RANGE;
  return { x: u * WORLD_W, y: v * WORLD_H };
}

// Single shared anchor for every zoomed-in stop, on the Gulf of Guinea
// coast near Mount Cameroon — real coastline (so the simulation tile has
// actual landmass to raise) and a real active volcano (so the live-
// footage popup's volcano footage is genuinely of this spot), and
// deliberately close to GLOBAL_CENTER itself: this is the map's own
// center region, not a landmark picked for story variety. Putting every
// stop here means the flight in from the global view is nearly pure
// zoom with almost no pan, and every stop past that first one holds the
// same position — so "zoom directly to it" doesn't have to fight a long
// pan to read as direct, and drill-down/live-footage/simulation all
// stay in the one region they zoomed into instead of jumping the camera
// across the globe between them.
const REGIONAL = project(9, 4); // Gulf of Guinea coast, near Mount Cameroon
const SIMULATION_AOR = REGIONAL;
const SIMULATION_CAMERA: Point = REGIONAL;
const GLOBAL_CENTER: Point = { x: WORLD_W / 2, y: WORLD_H / 2 };

// One stop per feature slide, in the same order — and this order is the
// story: start pulled all the way back (the realistic global picture,
// real coastlines and all, with hazard markers standing in for live
// activity), zoom directly into the map's own center region for that
// region's local detail, hold there while a live-footage popup shows up
// next to it (no further camera move — see drawZoomScene's
// `settled`-gated popup), then stay on that exact same spot while a
// physics-based impact simulation runs on a computer screen shown right
// over the map (see drawSimulationScreen). Every stop after the first
// shares REGIONAL's x/y, and both zoomed-in flights are `directZoom` —
// no pull-back dip, no pan to a different point, so each one reads as
// exactly what it is: a straight zoom in place. The opening stop has no
// composition of its own — zoom < 1.5 skips per-stop detail entirely
// (see drawZoomScene) — it's just the pulled-all-the-way-back view of
// the real map, every stop and every ambient blip visible as a plain
// marker at once, exactly what "realistic view of events across the
// globe" needs to look like before drilling into any one of them.
export const DEFAULT_CAMERA_STOPS: CameraStop[] = [
  { x: GLOBAL_CENTER.x, y: GLOBAL_CENTER.y, zoom: 0.3, label: "GLOBAL SITUATIONAL PICTURE" },
  { x: REGIONAL.x, y: REGIONAL.y, zoom: 3.2, label: "SECTOR 4 · REGIONAL DRILL-DOWN", directZoom: true },
  { x: REGIONAL.x, y: REGIONAL.y, zoom: 3.2, label: "SECTOR 4 · LIVE GROUND FEED" },
  { x: SIMULATION_CAMERA.x, y: SIMULATION_CAMERA.y, zoom: 2.8, label: "COASTAL AOR · IMPACT SIMULATION", directZoom: true },
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
  private from: CameraStop;
  private to: CameraStop;
  private current: CameraState;
  private animStart = 0;
  private animating = false;

  constructor(stops: CameraStop[]) {
    this.stops = stops;
    const s0 = stops[0] ?? { x: 0, y: 0, zoom: 1, label: "" };
    this.from = { ...s0 };
    this.to = { ...s0 };
    this.current = { ...s0, settled: 1, fromLabel: s0.label, toLabel: s0.label };
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
    this.current = { ...target, settled: 1, fromLabel: target.label, toLabel: target.label };
    this.animating = false;
  }

  setActive(index: number, now: number) {
    const clamped = Math.min(this.stops.length - 1, Math.max(0, index));
    if (clamped === this.activeIndex) return;
    this.activeIndex = clamped;
    this.from = { x: this.current.x, y: this.current.y, zoom: this.current.zoom, label: this.current.label };
    this.to = { ...this.stops[clamped]! };
    this.animStart = now;
    this.animating = true;
  }

  update(now: number): CameraState {
    if (!this.animating) return this.current;
    const elapsed = now - this.animStart;
    if (elapsed >= TRANSITION_MS) {
      this.current = { ...this.to, settled: 1, fromLabel: this.to.label, toLabel: this.to.label };
      this.animating = false;
      return this.current;
    }
    const moveT = smoothstep(elapsed / TRANSITION_MS);
    // Two adjacent stops can share the same x/y/zoom on purpose (the
    // live-footage popup holds the camera still and just adds an
    // overlay) — skip the pull-back dip entirely in that case so the
    // transition is a pure fade, not a phantom zoom pulse with nowhere
    // to actually go. Same for any stop explicitly marked directZoom.
    const samePosition = this.from.x === this.to.x && this.from.y === this.to.y && this.from.zoom === this.to.zoom;
    const pullback = samePosition || this.to.directZoom ? 0 : Math.sin(moveT * Math.PI) * PULLBACK;
    const zoomLerp = lerp(this.from.zoom, this.to.zoom, moveT);
    this.current = {
      x: lerp(this.from.x, this.to.x, moveT),
      y: lerp(this.from.y, this.to.y, moveT),
      zoom: zoomLerp * (1 - pullback),
      label: moveT < 0.5 ? this.from.label : this.to.label,
      settled: moveT,
      fromLabel: this.from.label,
      toLabel: this.to.label,
    };
    return this.current;
  }
}

// ---- real world map: the same coastline dataset and visual treatment
// as the About page hero (see apps/site/.../useGroundedMap.ts) — actual
// Natural-Earth-derived landmass polygons projected equirectangularly,
// not an abstract texture. Pan/zoom across this is a genuine zoom into
// an actual map: the same coastline geometry, just more of it filling
// the frame and more of its detail readable as the camera pushes in.
function drawWorldMap(ctx: CanvasRenderingContext2D, zoom: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighten";
  // Thinner and considerably less opaque than the About hero's own
  // version of this same map: there, the coastline is the only content
  // on the canvas. Here it shares a frame with the rest of this design
  // system's hairline UI chrome (product-scene-card borders, dashed
  // AORs, radar sweeps, all in the 0.12-0.35 alpha range) — at the
  // hero's 0.42 the coastline read as bolder/thicker than everything
  // else drawn on top of it.
  ctx.lineWidth = 0.9 / zoom;
  for (const poly of coastlines) {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const p = project(lon, lat);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(120,150,190,0.05)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1 / zoom;
  for (let lon = Math.ceil(LON0 / 30) * 30; lon <= LON1; lon += 30) {
    const x = project(lon, 0).x;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD_H);
    ctx.stroke();
  }
  for (let lat = Math.ceil(LAT0 / 30) * 30; lat <= LAT1; lat += 30) {
    const y = project(0, lat).y;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_W, y);
    ctx.stroke();
  }
  const eqY = project(0, 0).y;
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.beginPath();
  ctx.moveTo(0, eqY);
  ctx.lineTo(WORLD_W, eqY);
  ctx.stroke();
  ctx.restore();
}

// Small helper so the monitor's bezel/screen/popovers can all share one
// consistent "rounded rectangle" corner language instead of the sharp
// right angles everywhere else in this scene's otherwise-technical
// hairline style — a real display (and the software floating on it)
// has soft corners; the HUD chrome around it doesn't need to.
function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

// The physics-simulation stop's whole presentation: not a physical
// model (see history — the map turning on an axis into a raised relief
// block) but a computer screen showing a simulated visualization of the
// same coastal AOR — the thing this feature actually is: physics and
// analytics run against live conditions, watched on a display, not a
// diorama. Built as an actual monitor — a filled outer bezel with a
// distinct inset "glass" screen inside it, not a thin corner-bracket
// viewfinder frame (that read as a camera/recording overlay, not a
// display). Sized directly off the canvas's own w/h and the camera's
// live zoom so it fills the ENTIRE frame with just a thin bezel margin
// — nothing (the flat map's edge, the compass, the DOM badge/card) ends
// up outside it, because there's essentially no "outside" left once
// this is showing. The real coastline drawn inside keeps this anchored
// to the exact spot regional drill-down/live footage already
// established, so it reads as "this same place, now being simulated."
function drawSimulationScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  camZoom: number,
  t: number,
  riseT: number,
) {
  if (riseT <= 0.01) return;
  const cx = SIMULATION_CAMERA.x;
  const cy = SIMULATION_CAMERA.y;

  // marginPx/bezelPx are screen pixels, converted to world units by the
  // live zoom — this is what guarantees the monitor's rendered bounds
  // land at a fixed, predictable distance from the actual frame edge
  // (see ProductZoomScene.tsx's simulation overlay, positioned to this
  // same 20px inner-screen inset) regardless of how zoomed in the
  // camera happens to be.
  const marginPx = 12;
  const bezelPx = 8;
  const halfW = w / 2 / camZoom - marginPx / camZoom;
  const halfH = h / 2 / camZoom - marginPx / camZoom;
  const bezel = bezelPx / camZoom;
  const x0 = cx - halfW;
  const x1 = cx + halfW;
  const y0 = cy - halfH;
  const y1 = cy + halfH;
  const sx0 = x0 + bezel;
  const sx1 = x1 - bezel;
  const sy0 = y0 + bezel;
  const sy1 = y1 - bezel;

  // Two beats inside riseT's own 0-1 range: a fast CRT-style power-on
  // (the screen unrolls vertically) finishing at riseT 0.25, then the
  // simulation content fades up and starts visibly running once the
  // screen is actually open — so it reads as "screen switches on, THEN
  // the simulation starts," not both happening at once.
  const powerOn = clamp01(riseT / 0.25);
  const contentIn = clamp01((riseT - 0.2) / 0.8);
  const scaleY = 0.04 + 0.96 * smoothstep(powerOn);

  ctx.save();
  ctx.globalAlpha = riseT;
  ctx.translate(cx, cy);
  ctx.scale(1, scaleY);
  ctx.translate(-cx, -cy);

  // Outer bezel — the monitor's own physical frame, a filled panel
  // rather than a hairline (so it reads as an object sitting in the
  // scene, not just an outline drawn over the map), with rounded
  // corners like an actual display's housing instead of this scene's
  // usual sharp technical edges.
  const bezelRadius = 5;
  const screenRadius = 3;
  roundedRectPath(ctx, x0, y0, x1 - x0, y1 - y0, bezelRadius);
  ctx.fillStyle = "rgb(15,17,16)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Inner screen — the "glass," inset from the bezel by a consistent
  // margin on every side.
  roundedRectPath(ctx, sx0, sy0, sx1 - sx0, sy1 - sy0, screenRadius);
  ctx.fillStyle = "rgb(6,9,8)";
  ctx.fill();

  ctx.save();
  roundedRectPath(ctx, sx0, sy0, sx1 - sx0, sy1 - sy0, screenRadius);
  ctx.clip();

  // A simulation display's own coordinate grid — tighter and dimmer
  // than the real map's graticule, reads as software chrome rather than
  // the map bleeding through underneath.
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.6;
  for (let gx = sx0; gx <= sx1; gx += 20) {
    ctx.beginPath();
    ctx.moveTo(gx, sy0);
    ctx.lineTo(gx, sy1);
    ctx.stroke();
  }
  for (let gy = sy0; gy <= sy1; gy += 20) {
    ctx.beginPath();
    ctx.moveTo(sx0, gy);
    ctx.lineTo(sx1, gy);
    ctx.stroke();
  }

  if (contentIn > 0.01) {
    ctx.save();
    ctx.globalAlpha = contentIn;

    // The real coastline, drawn with the exact same stroke/fill weight
    // drawWorldMap already uses for regional drill-down/live footage's
    // own backdrop — this is a simulation OF that same place and same
    // map, so the line itself should read as the same line, not a
    // bolder redraw of it.
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 0.9 / camZoom;
    for (const poly of coastlines) {
      ctx.beginPath();
      poly.forEach(([lon, lat], i) => {
        const p = project(lon, lat);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(120,150,190,0.05)";
      ctx.fill();
      ctx.stroke();
    }

    // The event itself, actually playing out — an impact radius
    // expanding out of the AOR on a loop, the thing a running
    // physics/analytics simulation would show, not a static snapshot.
    // Helps teams "rehearse the response before it happens," per the
    // slide copy — this is that rehearsal, visibly in motion.
    const origin = { x: cx - 14, y: cy + 8 };
    const playT = (t * 0.09) % 1;
    for (let ring = 0; ring < 3; ring++) {
      const rt = (playT + ring / 3) % 1;
      const radius = 8 + rt * 92;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, radius, 0, TAU);
      ctx.strokeStyle = `rgba(207,159,82,${0.32 * (1 - rt)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    const fillR = 10 + playT * 60;
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, fillR, 0, TAU);
    ctx.fillStyle = "rgba(207,159,82,0.1)";
    ctx.fill();
    glowDot(ctx, origin.x, origin.y, 6, 0.6, "207,159,82");

    // Projected forecast cone, dashed — the thing an analyst watching
    // this simulation would actually be reading off it.
    const coneAngle = Math.atan2(1, 1.6);
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + Math.cos(coneAngle) * 100, origin.y + Math.sin(coneAngle) * 100 - 40);
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + Math.cos(coneAngle) * 100, origin.y + Math.sin(coneAngle) * 100 + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // A few secondary activity pips scattered across the tile — the
    // same cluster texture stop 0's global hazard markers and stop 1's
    // regional composition both carry, so the simulation reads as just
    // as densely alive as everything else in this scene, not a single
    // isolated event on an empty grid.
    [
      { x: sx1 - 30, y: sy0 + 40, color: "111,174,130" },
      { x: sx0 + 28, y: sy1 - 30, color: "196,106,94" },
      { x: sx1 - 46, y: sy1 - 22, color: "207,159,82" },
    ].forEach((m, i) => drawMinorBlip(ctx, m.x, m.y, m.color, t, i + 20));

    // Two small floating panels, styled like actual software chrome
    // (rounded corners, a header strip, an opaque fill — the same
    // "real device surface" treatment drawLiveFootagePopup already
    // uses) rather than a shaded/shadowed card — this scene's hairline
    // HUD language stays thin lines and flat fills throughout, no drop
    // shadows anywhere else in either PDP's animation, so none here
    // either. The thing that sells "this is a computer simulation"
    // beyond just "a screen showing a map": real analysis software has
    // windows and readouts popped open over the view, not just the
    // view itself.
    ctx.save();

    // A mini stats readout, top-left of the screen — a header strip
    // with two status dots over a small live bar chart, no legible text
    // (canvas text renders oversized at this zoom, same reason nothing
    // else in this scene uses it) — just the SHAPE of a data panel.
    const rx = sx0 + 14;
    const ry = sy0 + 14;
    const rw = 46;
    const rh = 32;
    roundedRectPath(ctx, rx, ry, rw, rh, 3);
    ctx.fillStyle = "rgba(11,15,13,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    roundedRectPath(ctx, rx, ry, rw, rh, 3);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(rx + 1, ry + 1, rw - 2, 5);
    [
      ["196,106,94", rx + 5],
      ["207,159,82", rx + 9],
    ].forEach(([color, dotX]) => {
      ctx.beginPath();
      ctx.arc(dotX as number, ry + 3.5, 1, 0, TAU);
      ctx.fillStyle = `rgba(${color},0.85)`;
      ctx.fill();
    });
    const bars = 5;
    const chartX0 = rx + 5;
    const chartBaseY = ry + rh - 4;
    const chartStep = (rw - 10) / bars;
    for (let i = 0; i < bars; i++) {
      const phase = Math.sin(t * 0.8 + i * 1.3) * 0.5 + 0.5;
      const barH = 3 + phase * (rh - 14);
      ctx.fillStyle = `rgba(207,159,82,${0.35 + phase * 0.35})`;
      ctx.fillRect(chartX0 + i * chartStep, chartBaseY - barH, chartStep - 2, barH);
    }

    // A tooltip-style callout hanging off the impact point itself — a
    // small value readout with a pointer nub, exactly the kind of
    // "hovering over the sim" popover a real analytics tool would show.
    const bx = origin.x + 26;
    const by = origin.y - 34;
    const bw = 40;
    const bh = 18;
    ctx.beginPath();
    ctx.moveTo(bx + 8, by + bh);
    ctx.lineTo(origin.x + 6, origin.y - 6);
    ctx.lineTo(bx + 16, by + bh);
    ctx.closePath();
    ctx.fillStyle = "rgba(11,15,13,0.92)";
    ctx.fill();
    roundedRectPath(ctx, bx, by, bw, bh, 4);
    ctx.fillStyle = "rgba(11,15,13,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    roundedRectPath(ctx, bx, by, bw, bh, 4);
    ctx.stroke();
    const valPad = 5;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx + valPad, by + bh - 5);
    ctx.lineTo(bx + bw - valPad, by + bh - 5);
    ctx.stroke();
    const valX = bx + valPad + (bw - 2 * valPad) * playT;
    glowDot(ctx, valX, by + bh - 5, 3, 0.7, "207,159,82");

    ctx.restore();

    ctx.restore();
  }

  // Scanlines — the one texture cue that reads unmistakably as "this is
  // a screen," not a map or a photo.
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let sy = sy0; sy <= sy1; sy += 3) {
    ctx.beginPath();
    ctx.moveTo(sx0, sy);
    ctx.lineTo(sx1, sy);
    ctx.stroke();
  }

  ctx.restore(); // clip

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 0.8;
  roundedRectPath(ctx, sx0, sy0, sx1 - sx0, sy1 - sy0, screenRadius);
  ctx.stroke();

  // Power LED, bottom-center of the bezel — where a real monitor's own
  // power indicator sits, steady green once fully switched on.
  if (powerOn >= 0.99) {
    ctx.beginPath();
    ctx.arc((x0 + x1) / 2, y1 - bezel / 2, 2.2, 0, TAU);
    ctx.fillStyle = "rgba(111,174,130,0.9)";
    ctx.fill();
  }

  ctx.restore();
}

// ---- placeholder local point-of-interest compositions ----

function drawSectorWest(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const cx = REGIONAL.x;
  const cy = REGIONAL.y;

  // A local fine grid, same reasoning as drawSimulationScreen's own —
  // the real map's graticule is spaced 30° apart (~167 world units),
  // so at this stop's ~3x zoom at most one or two of its lines cross
  // the frame at all, leaving most of the view a bare dark backdrop.
  // This tighter grid is what actually reads as "as densely detailed
  // as the pulled-back global view," the same way it does for the
  // simulation screen. Kept as faint as stop 0's own graticule — this
  // stop's own zoom is already ~10x stop 0's, so anything drawn at the
  // same alpha/weight those world-unit constants would carry at global
  // zoom ends up reading far bolder here purely from the zoom multiplier,
  // not any deliberate emphasis. Every hand-tuned size/alpha below this
  // point is scaled down with that same ~10x ratio in mind, so this
  // stop's chrome sits at the same visual weight stop 0's does instead
  // of dominating the frame.
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 0.5;
  const gridSpan = 260;
  for (let gx = cx - gridSpan; gx <= cx + gridSpan; gx += 15) {
    ctx.beginPath();
    ctx.moveTo(gx, cy - gridSpan);
    ctx.lineTo(gx, cy + gridSpan);
    ctx.stroke();
  }
  for (let gy = cy - gridSpan; gy <= cy + gridSpan; gy += 15) {
    ctx.beginPath();
    ctx.moveTo(cx - gridSpan, gy);
    ctx.lineTo(cx + gridSpan, gy);
    ctx.stroke();
  }

  // A few minor activity pips, the same texture stop 0's hazard
  // clusters use — so this close-up reads as more of the same live
  // feed, not a sparser, differently-styled composition.
  [
    { x: cx - 90, y: cy + 155, color: "207,159,82" },
    { x: cx + 175, y: cy - 35, color: "196,106,94" },
    { x: cx - 155, y: cy - 25, color: "111,174,130" },
    { x: cx - 210, y: cy + 60, color: "230,140,80" },
    { x: cx + 30, y: cy + 170, color: "207,159,82" },
    { x: cx + 140, y: cy + 130, color: "111,174,130" },
  ].forEach((m, i) => drawMinorBlip(ctx, m.x, m.y, m.color, t, i + 10));

  // The storm system itself: a directional threat cone (the probable
  // impact swath, same read as a real hurricane-ops display's cone of
  // uncertainty) fanning out from the center, with a soft expanding
  // gradient ping marking the event's own position — not a bullseye of
  // concentric rings and tick marks, just the same glow-and-pulse
  // language stop 0's hazard markers already use, at this stop's own
  // scale. This stop sits right on Mount Cameroon (REGIONAL — see
  // DEFAULT_CAMERA_STOPS), at ~4°N: too close to the equator for a
  // tropical cyclone to ever actually organize there (the Coriolis
  // effect is essentially zero within a few degrees of the equator —
  // real cyclones don't form this close to it), but it's one of
  // Africa's few genuinely active volcanoes, so the center event here
  // is a volcanic eruption — the cone below reads as the ash plume's
  // downwind dispersal, not a storm's track.
  const plumeDir = -0.5;
  const plumeSpread = 0.5;
  const plumeLen = 110;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, plumeLen, plumeDir - plumeSpread, plumeDir + plumeSpread);
  ctx.closePath();
  ctx.clip();
  const plumeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, plumeLen);
  plumeGrad.addColorStop(0, "rgba(230,140,80,0.26)");
  plumeGrad.addColorStop(1, "rgba(230,140,80,0)");
  ctx.fillStyle = plumeGrad;
  ctx.fillRect(cx - plumeLen, cy - plumeLen, plumeLen * 2, plumeLen * 2);
  ctx.restore();

  pingRings(ctx, cx, cy, t, 2.6, 34, "230,140,80", 2);
  glowDot(ctx, cx, cy, 16, 0.4, "230,140,80");

  // Volcanic seismicity — a real eruption's near-constant companion —
  // rather than a second storm cell, which would carry the same
  // too-close-to-the-equator implausibility as the main event.
  const seismic = { x: cx + 150, y: cy - 100 };
  pingRings(ctx, seismic.x, seismic.y, t, 2.4, 20, "196,106,94", 2);
  glowDot(ctx, seismic.x, seismic.y, 5, 0.55, "196,106,94");

  const tremor2 = { x: cx - 170, y: cy - 60 };
  pingRings(ctx, tremor2.x, tremor2.y, t, 2.1, 14, "196,106,94", 2);
  glowDot(ctx, tremor2.x, tremor2.y, 4, 0.4, "196,106,94");

  // A marine swell marker off the coast — the same wave iconography
  // stop 0's marine hazard glyphs use.
  const marine = { x: cx - 200, y: cy + 175 };
  ctx.strokeStyle = "rgba(111,174,130,0.65)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 2; i++) {
    const wy = marine.y + i * 4 - 2;
    ctx.beginPath();
    for (let wx = -7; wx <= 7; wx += 2) {
      const yy = wy + Math.sin((wx + t * 20) * 0.5) * 1.4;
      if (wx === -7) ctx.moveTo(marine.x + wx, yy);
      else ctx.lineTo(marine.x + wx, yy);
    }
    ctx.stroke();
  }
  glowDot(ctx, marine.x, marine.y, 9, 0.14, "111,174,130");

  ctx.restore();
}

// ------------------------------------------------------- LIVE FOOTAGE

// A small popup that shows up next to the region's own marker to call
// out live footage from that spot — not a takeover of the frame, and
// nothing inside it drifts or pans once it's shown. The camera holds
// perfectly still for this stop (see DEFAULT_CAMERA_STOPS and the
// same-position check in CameraController.update); the only thing that
// changes is this popup fading/scaling in, connected back to the
// marker with a leader line — the same callout language the About
// hero's map already uses for its own contact call-outs.
function drawLiveFootagePopup(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Close to the region's own center rather than out at sectorWest's
  // seismic/volcano markers — those sit ~150-220 world units out, past
  // the edge of what's actually visible at this stop's zoom. Anchored
  // near-center and growing down-right keeps the whole popup on screen.
  const markerX = REGIONAL.x - 20;
  const markerY = REGIONAL.y - 25;
  const vw = 92;
  const vh = 58;
  const x = markerX + 14;
  const y = markerY + 14;

  // Grows out of the marker rather than appearing at full size —
  // still a "show up," not a pan or drift.
  const scale = 0.82 + 0.18 * alpha;
  ctx.translate(markerX, markerY);
  ctx.scale(scale, scale);
  ctx.translate(-markerX, -markerY);

  ctx.beginPath();
  ctx.moveTo(markerX, markerY);
  ctx.lineTo(x, y + vh);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(markerX, markerY, 2.2, 0, TAU);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fill();

  // Fully opaque — this is a video feed, not a glass HUD panel; nothing
  // behind it (the map, the AOR ring) should show through it.
  ctx.fillStyle = "rgb(8,11,8)";
  ctx.fillRect(x, y, vw, vh);

  const horizonY = y + vh * 0.62;

  // What this feed is actually pointed at: the same eruption
  // drawSectorWest already flags on the map, not a generic skyline —
  // a night sky lit by the vent's own glow, a layered/jagged cone
  // silhouette, a visible lava flow down the near slope, and a
  // downwind ash plume that darkens as it rises and cools, the one
  // motion inherent to watching a real eruption, not camera drift.
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, vw, vh);
  ctx.clip();

  const peakX = x + vw * 0.52;
  const peakY = y + vh * 0.22;

  // Night sky with the eruption's own ambient light on it — a dark
  // gradient rather than a flat fill, warming toward the horizon where
  // the glowing vent would actually be lighting the underside of the
  // ash column. This one gradient is what stops the shot from reading
  // as a flat cutout.
  const sky = ctx.createLinearGradient(x, y, x, y + vh);
  sky.addColorStop(0, "rgba(6,7,10,1)");
  sky.addColorStop(0.55, "rgba(10,9,10,1)");
  sky.addColorStop(1, "rgba(26,14,10,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, vw, vh);
  const craterPulse = 0.6 + 0.4 * Math.sin(t * 1.6);
  glowDot(ctx, peakX, peakY + 6, 30 * craterPulse, 0.14, "230,140,80");

  // A fainter, more distant ridge behind the main cone — the
  // atmospheric-perspective layering a real long-lens shot of a
  // volcano actually has, not one flat silhouette alone.
  ctx.beginPath();
  ctx.moveTo(x - 4, horizonY - 2);
  ctx.lineTo(x + vw * 0.18, horizonY - 9);
  ctx.lineTo(x + vw * 0.36, horizonY - 3);
  ctx.lineTo(x + vw * 0.68, horizonY - 11);
  ctx.lineTo(x + vw * 0.86, horizonY - 4);
  ctx.lineTo(x + vw + 4, horizonY - 1);
  ctx.lineTo(x + vw + 4, horizonY + 3);
  ctx.lineTo(x - 4, horizonY + 3);
  ctx.closePath();
  ctx.fillStyle = "rgba(120,110,110,0.14)";
  ctx.fill();

  // The cone itself — a jagged, irregular profile (several facet
  // points down each slope) instead of one perfect triangle, the same
  // "not a clean geometric shape" read real terrain has.
  ctx.beginPath();
  ctx.moveTo(x - 4, horizonY);
  ctx.lineTo(x + vw * 0.18, horizonY - vh * 0.1);
  ctx.lineTo(x + vw * 0.3, horizonY - vh * 0.22);
  ctx.lineTo(peakX - 6, peakY + 5);
  ctx.lineTo(peakX, peakY);
  ctx.lineTo(peakX + 7, peakY + 4);
  ctx.lineTo(x + vw * 0.74, horizonY - vh * 0.18);
  ctx.lineTo(x + vw * 0.88, horizonY - vh * 0.06);
  ctx.lineTo(x + vw + 4, horizonY);
  ctx.lineTo(x + vw + 4, y + vh + 2);
  ctx.lineTo(x - 4, y + vh + 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(20,17,17,1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 0.6;
  ctx.stroke();

  // Smoke drifting downwind — the plume itself is the whole "this
  // volcano is active" read here, so it gets more presence than a
  // couple of faint wisps: darkening from a warm base near the vent to
  // sooty gray as it rises and cools (real volcanic ash is gray-black,
  // not white).
  for (let i = 0; i < 6; i++) {
    const phase = ((t * 0.04) + i / 6) % 1;
    const drift = phase * 30;
    const sx = peakX + drift * 0.85 + Math.sin(i * 1.7) * 2.5;
    const sy = peakY - drift * 0.8 - i * 1.2;
    const warm = 1 - phase;
    glowDot(ctx, sx, sy, 6 + phase * 11, (1 - phase) * 0.26, warm > 0.55 ? "230,150,90" : "80,76,76");
  }

  // Fixed grain — a texture, not a re-seeded-per-frame flicker, so
  // nothing here reads as moving once the popup is showing.
  for (let i = 0; i < 26; i++) {
    const n1raw = Math.sin(i * 12.9898) * 43758.5453;
    const n2raw = Math.sin(i * 4.898) * 24634.634;
    const n1 = n1raw - Math.floor(n1raw);
    const n2 = n2raw - Math.floor(n2raw);
    ctx.fillStyle = `rgba(255,255,255,${0.03 + n1 * 0.05})`;
    ctx.fillRect(x + n1 * vw, y + n2 * vh, 1, 1);
  }

  // Signal-strength bars, opposite corner from the REC dot — small,
  // steady, no legible text (same reason nothing else at this scale
  // uses it).
  for (let i = 0; i < 4; i++) {
    const barH = 2 + i * 1.6;
    ctx.fillStyle = `rgba(255,255,255,${0.35 + i * 0.12})`;
    ctx.fillRect(x + vw - 20 + i * 4, y + 12 - barH, 2.4, barH);
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1.1;
  ctx.strokeRect(x, y, vw, vh);

  const bl = 6;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.4;
  [
    [x, y, 1, 1],
    [x + vw, y, -1, 1],
    [x, y + vh, 1, -1],
    [x + vw, y + vh, -1, -1],
  ].forEach(([cornerX, cornerY, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cornerX + bl * dx, cornerY);
    ctx.lineTo(cornerX, cornerY);
    ctx.lineTo(cornerX, cornerY + bl * dy);
    ctx.stroke();
  });

  // The only thing still moving once the popup is fully shown: a
  // blink in place on the REC dot, never a position change.
  const recPulse = 0.6 + 0.4 * Math.sin(t * 3);
  ctx.beginPath();
  ctx.arc(x + 9, y + 9, 2.4, 0, TAU);
  ctx.fillStyle = `rgba(196,106,94,${recPulse})`;
  ctx.fill();

  ctx.restore();
}

// Hazard-type activity markers scattered around the real map so the
// pulled-back global stop reads as "a live network with real activity
// on it," not a handful of anonymous dots — a soft heat-glow under
// each plus a type-specific glyph (storm swirl, seismic burst, volcano,
// swell) borrowing the exact same iconography drawSectorWest already
// uses up close, just legible at global zoom. Nine real, roughly-spread
// hazard-plausible coastal points across every populated continent —
// enough that the map reads as a genuinely global feed, not four dots
// that happen to be on for the demo.
type HazardType = "storm" | "seismic" | "volcano" | "marine";
const AMBIENT_BLIP_POINTS: { lon: number; lat: number; color: string; type: HazardType }[] = [
  { lon: -15, lat: 10, color: "111,174,130", type: "marine" }, // West Africa coast
  { lon: 122, lat: 13, color: "207,159,82", type: "storm" }, // Philippines
  { lon: -72, lat: -33, color: "196,106,94", type: "seismic" }, // Chile
  { lon: -150, lat: 60, color: "230,140,80", type: "volcano" }, // South Alaska
  { lon: 140, lat: 36, color: "196,106,94", type: "seismic" }, // Japan
  { lon: 105, lat: -6, color: "230,140,80", type: "volcano" }, // Java, Indonesia
  { lon: -90, lat: 22, color: "207,159,82", type: "storm" }, // Gulf of Mexico
  { lon: 33, lat: 38, color: "196,106,94", type: "seismic" }, // Anatolia
  { lon: 88, lat: 15, color: "207,159,82", type: "storm" }, // Bay of Bengal
];

// A handful of the primary points above are the anchor of a genuine
// cluster — several smaller, simpler pips jittered close around them,
// the way aftershocks or a storm's outer cells actually show up on a
// real hazard feed as more than one point. Deliberately lighter-weight
// than the primary glyphs (see drawMinorBlip) so a cluster reads as
// "more activity near this one hazard," not nine more things all
// competing for the same attention.
const CLUSTER_ANCHORS = [0, 2, 4, 6]; // indices into AMBIENT_BLIP_POINTS
const MINOR_BLIP_POINTS = CLUSTER_ANCHORS.flatMap((anchorIdx) => {
  const anchor = AMBIENT_BLIP_POINTS[anchorIdx]!;
  const count = 2 + (anchorIdx % 3);
  return Array.from({ length: count }, (_, i) => {
    const angle = (anchorIdx * 1.7 + i * 2.3) % TAU;
    const dist = 5 + ((anchorIdx + i) % 3) * 2.5;
    return {
      lon: anchor.lon + Math.cos(angle) * dist,
      lat: anchor.lat + Math.sin(angle) * dist * 0.7,
      color: anchor.color,
    };
  });
});

const AMBIENT_BLIPS = AMBIENT_BLIP_POINTS.map((b) => ({ ...project(b.lon, b.lat), color: b.color, type: b.type }));
const MINOR_BLIPS = MINOR_BLIP_POINTS.map((b) => ({ ...project(b.lon, b.lat), color: b.color }));

function drawHazardGlyph(ctx: CanvasRenderingContext2D, x: number, y: number, type: HazardType, color: string, t: number) {
  // Heat glow first, under every glyph — the "activity" density read
  // that makes this a heat map, not just a set of icons.
  glowDot(ctx, x, y, 32, 0.26, color);

  switch (type) {
    case "storm": {
      ctx.strokeStyle = `rgba(${color},0.8)`;
      ctx.lineWidth = 1.3;
      const spin = t * 0.6;
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.arc(x, y, 8 + i * 5, spin + i * Math.PI, spin + i * Math.PI + Math.PI * 1.3);
        ctx.stroke();
      }
      break;
    }
    case "seismic": {
      pingRings(ctx, x, y, t, 2.2, 24, color, 2);
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, TAU);
      ctx.fillStyle = `rgba(${color},0.9)`;
      ctx.fill();
      break;
    }
    case "volcano": {
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y - 13);
      ctx.lineTo(x + 11, y + 8);
      ctx.lineTo(x - 11, y + 8);
      ctx.closePath();
      ctx.stroke();
      glowDot(ctx, x, y - 13, 5 + Math.sin(t * 2) * 1.6, 0.6, color);
      break;
    }
    case "marine": {
      ctx.strokeStyle = `rgba(${color},0.75)`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 2; i++) {
        const wy = y + i * 6 - 3;
        ctx.beginPath();
        for (let wx = -11; wx <= 11; wx += 2) {
          const yy = wy + Math.sin((wx + t * 20) * 0.5) * 2.2;
          if (wx === -11) ctx.moveTo(x + wx, yy);
          else ctx.lineTo(x + wx, yy);
        }
        ctx.stroke();
      }
      break;
    }
  }
}

// A cluster pip — a soft glow and a small steady dot, nothing more.
// Where drawHazardGlyph is the legible "here's a named hazard" marker,
// this is the texture underneath it: several of these near one primary
// marker read as "activity clustered around this event," the way real
// aftershocks or a storm's outer cells show up as more than one point
// on a live feed, without every one of them competing for attention
// the way a full spinning/glowing glyph would.
function drawMinorBlip(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, t: number, seed: number) {
  const pulse = 0.55 + 0.45 * Math.sin(t * 1.1 + seed * 3.1);
  glowDot(ctx, x, y, 12, 0.14 * pulse, color);
  ctx.beginPath();
  ctx.arc(x, y, 1.6, 0, TAU);
  ctx.fillStyle = `rgba(${color},${0.5 + 0.3 * pulse})`;
  ctx.fill();
}

export function drawZoomScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  cam: CameraState,
  stops: CameraStop[],
) {
  ctx.clearRect(0, 0, w, h);

  // The hand-off from live footage to the simulation screen is ONE
  // continuous flight (see DEFAULT_CAMERA_STOPS — same position, so the
  // camera itself barely moves), split into two overlapping beats across
  // that flight's own `settled` progress: the footage popup fades OUT
  // over the first ~60%, the simulation screen clips/fades IN over the
  // last ~65%, with a short overlap around the middle so one visibly
  // dissolves into the other instead of leaving a dead gap. Both are
  // gated on `toLabel`/`fromLabel` rather than the flight-splitting
  // `label`, so they read correctly for the WHOLE flight regardless of
  // which half it's in (`label` itself flips at 50% and would cut this
  // off early). Reaches full state exactly as the flight completes, and
  // holds there at rest — no separate post-arrival clock needed.
  const simStop = stops[3];
  const headingToSim = simStop !== undefined && cam.toLabel === simStop.label;
  const simRevealT = headingToSim ? clamp01((cam.settled - 0.35) / 0.65) : 0;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);

  drawWorldMap(ctx, cam.zoom);

  // Each stop's detail fades in as the camera's live zoom approaches
  // that stop's own target zoom, and fades to a plain pulsing dot once
  // the camera pulls back past it — the same level-of-detail idea a
  // real map applies between building outlines and place markers.
  //
  // A symmetric band around each stop's own target zoom — not just a
  // lower bound — so a composition fades back OUT once the camera moves
  // past it in either direction. Gated by index rather than an absolute
  // zoom threshold: stop 0 (global) is the only one with no composition
  // of its own — the simulation stop is ALSO a low, pulled-back zoom
  // (a deliberately wide, presentation-style framing) but very much
  // still has its own composition to draw.
  const details = stops.map((stop, i) =>
    i === 0 ? 0 : clamp01(1 - Math.abs(cam.zoom - stop.zoom) / (stop.zoom * 0.22)),
  );

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    if (i === 0) continue; // the pulled-back global stop has no composition of its own
    if (i === 3) continue; // the simulation screen is drawn separately below, on top of everything else
    const detail = details[i]!;
    if (i === 1) {
      // Regional's own target zoom (3.2) sits close enough to the
      // simulation stop's resting zoom (2.8) that the zoom-band alone
      // never fully fades it out once settled there — harmless while
      // every stop had its own distinct spot on the globe, but now that
      // 1/2/3 all share REGIONAL's position (see DEFAULT_CAMERA_STOPS),
      // that leftover detail would draw sectorWest's radar/AOR chrome
      // underneath the simulation screen's opaque panel — wasted, but
      // more importantly it'd show through in the gap before the panel
      // has finished powering on. Cut it off outright once the camera
      // has actually settled on the simulation stop instead of letting
      // the band alone decide.
      const sectorDetail = cam.label === stops[3]?.label ? 0 : detail;
      drawSectorWest(ctx, t, sectorDetail);
    }
    if (i === 2) {
      // The live-footage popup shares the regional stop's exact camera
      // position (see DEFAULT_CAMERA_STOPS), so zoom-based `detail`
      // can't tell the two stops apart — it's gated on `fromLabel`/
      // `toLabel` instead. Arriving here: fades IN over a flight's back
      // half, same as before. Departing toward the simulation stop:
      // fades OUT over a flight's first half instead of cutting out the
      // instant `label` itself flips — see simRevealT above, which fades
      // the simulation screen in right as this fades out, so the video
      // footage visibly dissolves into the screen rather than vanishing.
      const arrivingHere = cam.toLabel === stop.label;
      const leavingHere = cam.fromLabel === stop.label && !arrivingHere;
      const popupAlpha = arrivingHere
        ? clamp01((cam.settled - 0.35) / 0.65)
        : leavingHere
          ? clamp01(1 - cam.settled / 0.6)
          : 0;
      drawLiveFootagePopup(ctx, t, popupAlpha);
      continue; // no fallback "haven't arrived" marker — stop 1 already covers this shared spot
    }
    if (detail < 0.94) {
      // The "haven't arrived yet" ping only means something while no
      // OTHER nearby stop already has the camera's full attention —
      // otherwise this stop's own marker just clutters a neighbor's
      // fully-detailed view.
      const eclipsed = stops.some(
        (other, j) => j !== i && details[j]! > 0.9 && Math.hypot(other.x - stop.x, other.y - stop.y) < 120,
      );
      if (!eclipsed) {
        glowDot(ctx, stop.x, stop.y, 10, 0.35 * (1 - detail), "255,255,255");
        pingRings(ctx, stop.x, stop.y, t, 2.8, 24, "255,255,255", 2);
      }
    }
  }

  // Minor cluster pips drawn first, underneath the primary markers, so
  // each cluster's anchor point stays the visually dominant one.
  MINOR_BLIPS.forEach((blip, i) => {
    drawMinorBlip(ctx, blip.x, blip.y, blip.color, t, i);
  });
  for (const blip of AMBIENT_BLIPS) {
    drawHazardGlyph(ctx, blip.x, blip.y, blip.type, blip.color, t);
  }

  // Drawn last so the screen sits on top of everything else in the
  // frame, the same stacking a real popup would want.
  drawSimulationScreen(ctx, w, h, cam.zoom, t, simRevealT);

  ctx.restore();

  // Compass stays screen-anchored, like a fixed instrument overlay — it
  // shouldn't zoom with the map. Sized/inset to land inside
  // drawSimulationScreen's own inner-screen bounds (20px from the
  // frame edge, see its marginPx/bezelPx) since that monitor now fills
  // the whole frame — this same fixed corner position ends up "on the
  // screen" once it's showing, not floating outside it.
  compassRose(ctx, w - 40, h - 46, 13);
}
