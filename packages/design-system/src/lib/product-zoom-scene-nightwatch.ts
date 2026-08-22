/**
 * Nightwatch's own camera-driven "one continuous pipeline" scene — the
 * same CameraController model as lib/product-zoom-scene.ts (see that
 * file's top comment for the full rationale), but the world it flies
 * over is a document pipeline instead of a map: raw feeds converge into
 * a single spine, the spine passes through a topic filter that only
 * lets selected topics continue, and what survives lands in a
 * consolidated report with its own summary chart and export control.
 * Three feature slides, one shared spine — the camera pulls back enough
 * between stops that the thread connecting all three is always visible,
 * which is what actually sells "these three things are one pipeline"
 * instead of three unrelated screenshots.
 */
import {
  TAU,
  lerp,
  clamp01,
  glowDot,
  pingRings,
  analogClock,
  feedIcon,
  envelopeIcon,
  type Point,
} from "./product-scene-draw";
import type { CameraStop, CameraState } from "./product-zoom-scene";

const SPINE_Y = 450;
const SPINE_X0 = 130;
const SPINE_X1 = 2560;

// Zoom decreases stop to stop on purpose: the picture gets bigger as more
// of the pipeline comes into view, so pulling back slightly at each stop
// reads as "more has accumulated here" rather than an arbitrary camera
// setting. Values are tuned so each stop's full composition (including
// its on-canvas text — unlike cobalt's abstract map iconography, the
// content here IS legible UI chrome) sits inside frame with margin, not
// cropped at the edges.
export const NIGHTWATCH_CAMERA_STOPS: CameraStop[] = [
  { x: 420, y: SPINE_Y, zoom: 1.0, label: "SOURCE INGEST" },
  { x: 1300, y: SPINE_Y, zoom: 0.9, label: "TOPIC FILTER" },
  { x: 2180, y: SPINE_Y, zoom: 0.8, label: "CONSOLIDATED REPORT" },
];

// Each region's own footprint on the spine — kept clear of the line
// itself so it never cuts across a feed card, a topic chip, or the
// report panel. The spine only fills the gaps between regions; each
// region draws its own connective lines from that gap into its content
// (the feed/hub lines, the topic branches, the report's stub), so the
// thread still reads as continuous without a raw line bleeding through
// the illustration on top of it.
const REGION_SPANS: [number, number][] = [
  [110, 480],
  [1030, 1570],
  [1890, 2460],
];

function drawSpine(ctx: CanvasRenderingContext2D, t: number, zoom: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.6 / zoom;
  let cursor = SPINE_X0;
  for (const [start, end] of REGION_SPANS) {
    if (cursor < start) {
      ctx.beginPath();
      ctx.moveTo(cursor, SPINE_Y);
      ctx.lineTo(start, SPINE_Y);
      ctx.stroke();
    }
    cursor = Math.max(cursor, end);
  }
  if (cursor < SPINE_X1) {
    ctx.beginPath();
    ctx.moveTo(cursor, SPINE_Y);
    ctx.lineTo(SPINE_X1, SPINE_Y);
    ctx.stroke();
  }

  // One continuous pulse traveling the full length of the pipeline —
  // the thing that reads as "the same story" even while the camera
  // sits still at one end of it. It fades out crossing a region's own
  // footprint (where that region's internal lines take over showing
  // the flow) and back in past it, rather than riding on top of the
  // illustration there.
  const period = 5.5;
  const prog = (t % period) / period;
  const px = lerp(SPINE_X0, SPINE_X1, prog);
  const FADE = 40;
  let pulseAlpha = 1;
  for (const [start, end] of REGION_SPANS) {
    let regionAlpha = 1;
    if (px >= start && px <= end) regionAlpha = 0;
    else if (px < start) regionAlpha = clamp01((start - px) / FADE);
    else regionAlpha = clamp01((px - end) / FADE);
    pulseAlpha = Math.min(pulseAlpha, regionAlpha);
  }
  if (pulseAlpha > 0.02) glowDot(ctx, px, SPINE_Y, 6, 0.85 * pulseAlpha, "111,174,130");
  ctx.restore();
}

// ------------------------------------------------------- SOURCE INGEST

const FEEDS: { label: string; y: number; color: string }[] = [
  { label: "WIRE SERVICE", y: 300, color: "111,174,130" },
  { label: "REGIONAL NEWS", y: 385, color: "207,159,82" },
  { label: "FIELD REPORT", y: 515, color: "207,159,82" },
  { label: "PARTNER FEED", y: 600, color: "196,106,94" },
];
const INGEST_HUB: Point = { x: 420, y: SPINE_Y };
const CARD_X = 130;
const CARD_W = 230;
const CARD_H = 48;

function drawSourceIngest(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  FEEDS.forEach((feed, i) => {
    const cy = feed.y;
    const prog = ((t * 0.22) + i * 0.25) % 1;
    const pulse = Math.max(0, 1 - Math.abs(prog - 0.94) * 22);

    ctx.beginPath();
    ctx.moveTo(CARD_X + CARD_W, cy);
    ctx.lineTo((CARD_X + CARD_W + INGEST_HUB.x) / 2, cy);
    ctx.lineTo(INGEST_HUB.x, INGEST_HUB.y);
    ctx.strokeStyle = `rgba(${feed.color},${0.4 + pulse * 0.45})`;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([2, 3]);
    ctx.lineDashOffset = -t * 18;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    ctx.strokeRect(CARD_X, cy - 22, CARD_W, CARD_H);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(CARD_X, cy - 22, CARD_W, CARD_H);

    feedIcon(ctx, CARD_X + 16, cy - 4, 6, 0.55);
    ctx.font = "600 11px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(feed.label, CARD_X + 30, cy - 2);
    ctx.fillStyle = `rgba(${feed.color},0.9)`;
    ctx.beginPath();
    ctx.arc(CARD_X + CARD_W - 12, cy - 4, 2.6, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(CARD_X + 10, cy + 10, (CARD_W - 20) * 0.65, 3);

    const midx = lerp(CARD_X + CARD_W, (CARD_X + CARD_W + INGEST_HUB.x) / 2, clamp01(prog * 2));
    const x = prog < 0.5 ? midx : lerp((CARD_X + CARD_W + INGEST_HUB.x) / 2, INGEST_HUB.x, clamp01((prog - 0.5) * 2));
    const y = prog < 0.5 ? cy : lerp(cy, INGEST_HUB.y, clamp01((prog - 0.5) * 2));
    glowDot(ctx, x, y, 5, Math.sin(prog * Math.PI) * 0.9, feed.color);
  });

  const hubPulse = 0.7 + 0.3 * Math.sin(t * 2);
  glowDot(ctx, INGEST_HUB.x, INGEST_HUB.y, 16, 0.35 * hubPulse, "111,174,130");
  ctx.font = "600 10px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.textAlign = "center";
  ctx.fillText("4 SOURCES", INGEST_HUB.x, INGEST_HUB.y + 34);
  ctx.textAlign = "left";
  ctx.restore();
}

// -------------------------------------------------------- TOPIC FILTER

const TOPICS: { label: string; on: boolean; x: number; y: number; w: number; h: number }[] = (() => {
  const labels: { label: string; on: boolean }[] = [
    { label: "GEOPOLITICS", on: true },
    { label: "CYBER OPS", on: true },
    { label: "ENERGY MKTS", on: false },
    { label: "MIL MOVEMENT", on: true },
    { label: "CLIMATE RISK", on: false },
    { label: "SUPPLY CHAIN", on: false },
  ];
  const chipW = 210;
  const chipH = 92;
  const gapX = 60;
  const gapY = 44;
  const gridX = 1300 - (chipW * 2 + gapX) / 2;
  const gridY = SPINE_Y - (chipH * 3 + gapY * 2) / 2;
  return labels.map((l, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    return {
      ...l,
      x: gridX + col * (chipW + gapX),
      y: gridY + row * (chipH + gapY),
      w: chipW,
      h: chipH,
    };
  });
})();
const FILTER_HUB: Point = { x: 1300, y: SPINE_Y };

function drawTopicFilter(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const focusIdx = Math.floor(t / 0.9) % TOPICS.length;

  TOPICS.forEach((tp, i) => {
    const cx = tp.x + tp.w;
    const cy = tp.y + tp.h / 2;
    const nearHubX = tp.x < FILTER_HUB.x ? tp.x + tp.w : tp.x;

    if (tp.on) {
      ctx.beginPath();
      ctx.moveTo(nearHubX, cy);
      ctx.lineTo(FILTER_HUB.x, FILTER_HUB.y);
      ctx.strokeStyle = "rgba(111,174,130,0.55)";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([2, 3]);
      ctx.lineDashOffset = -t * 16;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    } else {
      // Filtered out: the branch reaches partway toward the hub, then
      // stops at an open ring instead of connecting — a topic the
      // reader didn't choose visibly never rejoins the pipeline.
      const stopX = lerp(nearHubX, FILTER_HUB.x, 0.42);
      ctx.beginPath();
      ctx.moveTo(nearHubX, cy);
      ctx.lineTo(stopX, lerp(cy, FILTER_HUB.y, 0.42));
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(stopX, lerp(cy, FILTER_HUB.y, 0.42), 2.4, 0, TAU);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const isFocused = i === focusIdx;
    const focusAlpha = isFocused ? 0.35 + 0.25 * Math.sin(t * 6) : 0;
    ctx.strokeStyle = `rgba(255,255,255,${0.22 + focusAlpha})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(tp.x, tp.y, tp.w, tp.h);
    ctx.fillStyle = `rgba(255,255,255,${tp.on ? 0.05 : 0.02})`;
    ctx.fillRect(tp.x, tp.y, tp.w, tp.h);

    const boxSize = 9;
    const boxX = tp.x + 12;
    const boxY = tp.y + tp.h / 2 - boxSize / 2;
    if (tp.on) {
      const pulse = 0.75 + 0.25 * Math.sin(t * 2 + i);
      ctx.fillStyle = `rgba(111,174,130,${pulse})`;
      ctx.fillRect(boxX, boxY, boxSize, boxSize);
      ctx.strokeStyle = "rgba(4,4,4,0.9)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(boxX + 1.7, boxY + 4.7);
      ctx.lineTo(boxX + 3.8, boxY + 7.2);
      ctx.lineTo(boxX + 7.4, boxY + 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxSize, boxSize);
    }

    ctx.font = "600 11px ui-monospace, monospace";
    ctx.fillStyle = tp.on ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.32)";
    ctx.fillText(tp.label, boxX + boxSize + 10, tp.y + tp.h / 2 + 4);
  });

  const onCount = TOPICS.filter((tp) => tp.on).length;
  const hubPulse = 0.7 + 0.3 * Math.sin(t * 2);
  glowDot(ctx, FILTER_HUB.x, FILTER_HUB.y, 16, 0.35 * hubPulse, "111,174,130");
  ctx.font = "600 10px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.textAlign = "center";
  ctx.fillText(`${onCount}/${TOPICS.length} TOPICS ACTIVE`, FILTER_HUB.x, FILTER_HUB.y + 78);
  ctx.textAlign = "left";
  ctx.restore();
}

// ------------------------------------------------------ CONSOLIDATED REPORT

const REPORT_HUB: Point = { x: 2180, y: SPINE_Y };
const DONUT_SEGMENTS = [
  { value: 0.52, color: "111,174,130", label: "HEADLINES" },
  { value: 0.31, color: "207,159,82", label: "ANALYSIS" },
  { value: 0.17, color: "196,106,94", label: "GEO/WX" },
];
const REPORT_BARS = [0.18, 0.24, 0.16, 0.26, 0.2, 0.19, 0.92];

function drawConsolidatedReport(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  ctx.moveTo(1940, SPINE_Y);
  ctx.lineTo(1975, SPINE_Y);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const cx = 1989;
  const cy = 363;
  const rOuter = 58;
  const ringW = 24;
  let angle = -Math.PI / 2 + t * 0.05;
  DONUT_SEGMENTS.forEach((seg) => {
    const sweep = seg.value * TAU;
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, angle, angle + sweep - 0.03);
    ctx.strokeStyle = `rgba(${seg.color},0.9)`;
    ctx.lineWidth = ringW;
    ctx.stroke();
    angle += sweep;
  });
  ctx.font = "600 10px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.textAlign = "center";
  ctx.fillText("DATA MIX", cx, cy + 4);
  ctx.textAlign = "left";

  DONUT_SEGMENTS.forEach((seg, i) => {
    // rOuter + ringW/2 (58+12=70) is the ring's own outer edge — the
    // legend's first row needs to clear that, not just rOuter itself,
    // or its swatch square overlaps the ring's bottom arc.
    const ly = cy + rOuter + 24 + i * 17;
    ctx.fillStyle = `rgba(${seg.color},0.9)`;
    ctx.fillRect(cx - 76, ly - 8, 8, 8);
    ctx.font = "9.5px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText(seg.label, cx - 61, ly - 1);
  });

  const barsBase = cy + rOuter + 105;
  const barsMaxH = 44;
  const barW = 12;
  const gapW = 8;
  const barsX = cx - 76;
  ctx.beginPath();
  ctx.moveTo(barsX, barsBase);
  ctx.lineTo(barsX + REPORT_BARS.length * (barW + gapW), barsBase);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();
  REPORT_BARS.forEach((v, i) => {
    const hv = v * (0.95 + 0.05 * Math.sin(t * 1.4 + i));
    const bh = hv * barsMaxH;
    const bx = barsX + i * (barW + gapW);
    const isTall = i === REPORT_BARS.length - 1;
    ctx.fillStyle = isTall ? "rgba(111,174,130,0.85)" : "rgba(255,255,255,0.32)";
    ctx.fillRect(bx, barsBase - bh, barW, bh);
  });

  const expX = barsX;
  const expY = barsBase + 22;
  const expW = 178;
  const expH = 38;
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(expX, expY, expW, expH);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(expX, expY, expW, expH);
  const iconX = expX + 18;
  const iconY = expY + expH / 2;
  const dropProg = (t * 0.8) % 1;
  const arrowY = iconY - 5 + dropProg * 8;
  const arrowAlpha = dropProg < 0.75 ? 1 : (1 - dropProg) * 4;
  ctx.strokeStyle = `rgba(111,174,130,${0.8 * arrowAlpha})`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(iconX, iconY - 6);
  ctx.lineTo(iconX, arrowY);
  ctx.moveTo(iconX - 3, arrowY - 3);
  ctx.lineTo(iconX, arrowY);
  ctx.lineTo(iconX + 3, arrowY - 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(iconX - 5, iconY + 6);
  ctx.lineTo(iconX - 5, iconY + 9);
  ctx.lineTo(iconX + 5, iconY + 9);
  ctx.lineTo(iconX + 5, iconY + 6);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.font = "600 11px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillText("EXPORT PDF", iconX + 18, iconY + 4);

  const docX = 2131;
  const docY = 300;
  const docW = 300;
  const docH = 290;
  ctx.beginPath();
  ctx.moveTo(REPORT_HUB.x, SPINE_Y);
  ctx.lineTo(docX, docY + docH * 0.14 / 2 + 20);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([2, 3]);
  ctx.lineDashOffset = -t * 16;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1.3;
  ctx.strokeRect(docX, docY, docW, docH);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(docX, docY, docW, docH);

  envelopeIcon(ctx, docX + 14, docY + 12, 17, 11, 0.55);
  ctx.font = "600 12px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("CONSOLIDATED REPORT", docX + 40, docY + 22);
  ctx.beginPath();
  ctx.moveTo(docX + 12, docY + docH * 0.14);
  ctx.lineTo(docX + docW - 12, docY + docH * 0.14);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const blockCount = 4;
  const headerH = docH * 0.14;
  const rowH = (docH - headerH) / blockCount;
  for (let i = 0; i < blockCount; i++) {
    const ty = docY + headerH + rowH * (i + 0.5);
    const seg = DONUT_SEGMENTS[i % DONUT_SEGMENTS.length]!;
    ctx.fillStyle = `rgba(${seg.color},0.85)`;
    ctx.fillRect(docX + docW - 16, ty - 10, 3.5, 20);

    const blockX = docX + 22;
    const maxW = docW - 52;
    const headW = maxW * (0.72 + 0.14 * Math.sin(i * 2.3 + 1));
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(blockX, ty - 10, headW, 3);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(blockX, ty, headW * 0.8, 2);
    ctx.fillStyle = "rgba(255,255,255,0.13)";
    ctx.fillRect(blockX, ty + 8, headW * 0.52, 2);

    if (i < blockCount - 1) {
      ctx.beginPath();
      ctx.moveTo(docX + 12, ty + rowH / 2);
      ctx.lineTo(docX + docW - 12, ty + rowH / 2);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawNightwatchZoomScene(
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

  drawSpine(ctx, t, cam.zoom);

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    const detail = clamp01((cam.zoom - stop.zoom * 0.4) / (stop.zoom * 0.45));
    if (i === 0) drawSourceIngest(ctx, t, detail);
    if (i === 1) drawTopicFilter(ctx, t, detail);
    if (i === 2) drawConsolidatedReport(ctx, t, detail);
    if (detail < 0.94) {
      glowDot(ctx, stop.x, stop.y, 10, 0.3 * (1 - detail), "255,255,255");
      pingRings(ctx, stop.x, stop.y, t, 2.8, 24, "255,255,255", 2);
    }
  }

  ctx.restore();

  analogClock(ctx, w - 34, h - 40, 13);
}
