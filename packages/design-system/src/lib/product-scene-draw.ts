/**
 * Canvas drawing engine behind ProductScene (see components/ProductScene.tsx).
 * One scene per product — a literal, Linear-style rendering of what each
 * product actually does (an ops map, a travel-risk map, a case-progression
 * view, a briefing pipeline) rather than abstract iconography. Ported from
 * the "Alduin — Product Visual Concepts v7" exploration; copy, codes, and
 * coordinates drawn here are still placeholders, not real product data.
 */
const TAU = Math.PI * 2;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function easeInOut(t: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * clamp01(t));
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Point {
  x: number;
  y: number;
}

function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, color?: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(r, 0.001));
  const c = color || "255,255,255";
  g.addColorStop(0, `rgba(${c},${alpha})`);
  g.addColorStop(1, `rgba(${c},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(r, 0.001), 0, TAU);
  ctx.fill();
}

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, s: number): Point {
  const u = 1 - s;
  return {
    x: u * u * u * p0.x + 3 * u * u * s * p1.x + 3 * u * s * s * p2.x + s * s * s * p3.x,
    y: u * u * u * p0.y + 3 * u * u * s * p1.y + 3 * u * s * s * p2.y + s * s * s * p3.y,
  };
}

function drawPlane(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number, alpha?: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = `rgba(255,255,255,${alpha === undefined ? 1 : alpha})`;

  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(size * 0.3, size * 0.07);
  ctx.lineTo(-size * 0.9, size * 0.06);
  ctx.lineTo(-size, 0);
  ctx.lineTo(-size * 0.9, -size * 0.06);
  ctx.lineTo(size * 0.3, -size * 0.07);
  ctx.closePath();
  ctx.fill();

  [1, -1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(size * 0.15, side * size * 0.05);
    ctx.lineTo(-size * 0.1, side * size * 0.62);
    ctx.lineTo(-size * 0.32, side * size * 0.55);
    ctx.lineTo(-size * 0.05, side * size * 0.05);
    ctx.closePath();
    ctx.fill();
  });

  [1, -1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(-size * 0.65, side * size * 0.04);
    ctx.lineTo(-size * 0.92, side * size * 0.28);
    ctx.lineTo(-size * 0.98, side * size * 0.24);
    ctx.lineTo(-size * 0.78, side * size * 0.03);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

function drawPin(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color?: string) {
  ctx.save();
  const topY = y - size * 1.6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - size * 0.95, y - size * 0.95, x - size * 0.6, topY, x, topY);
  ctx.bezierCurveTo(x + size * 0.6, topY, x + size * 0.95, y - size * 0.95, x, y);
  ctx.closePath();
  ctx.fillStyle = color || "#ffffff";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y - size, size * 0.3, 0, TAU);
  ctx.fillStyle = "rgba(4,4,4,0.92)";
  ctx.fill();
  ctx.restore();
}

function dashedPolygon(ctx: CanvasRenderingContext2D, pts: Point[], alpha: number) {
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.closePath();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
}

function pingRings(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, period: number, maxR: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    const ph = ((t / period) + i / count) % 1;
    const r = ph * maxR;
    ctx.strokeStyle = `rgba(${color},${0.6 * (1 - ph)})`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
  }
}

// Shared map chrome: the coordinate grid, compass rose, scale bar, and edge
// tick labels that make a canvas read as a real GIS/ops map. Coordinates
// shown are placeholders.

function coordGrid(ctx: CanvasRenderingContext2D, w: number, h: number, origin: { lon: number; lat: number }, step: number, cols: number, rows: number) {
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.font = "9px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.textBaseline = "top";
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    if (i > 0 && i < cols) {
      const lon = (origin.lon + i * step).toFixed(2);
      ctx.fillText(lon + "°", x + 3, 3);
    }
  }
  for (let j = 0; j <= rows; j++) {
    const y = (j / rows) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    if (j > 0 && j < rows) {
      const lat = (origin.lat - j * step).toFixed(2);
      ctx.fillText(lat + "°", 3, y + 3);
    }
  }
}

function compassRose(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x - r * 0.22, y + r * 0.5);
  ctx.lineTo(x, y + r * 0.28);
  ctx.lineTo(x + r * 0.22, y + r * 0.5);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fill();
  ctx.font = "9px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "center";
  ctx.fillText("N", x, y - r - 11);
  ctx.textAlign = "left";
  ctx.restore();
}

function scaleBar(ctx: CanvasRenderingContext2D, x: number, y: number, widthPx: number, label: string) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + widthPx, y);
  ctx.moveTo(x, y - 4);
  ctx.lineTo(x, y + 4);
  ctx.moveTo(x + widthPx, y - 4);
  ctx.lineTo(x + widthPx, y + 4);
  ctx.stroke();
  ctx.font = "9px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.textAlign = "center";
  ctx.fillText(label, x + widthPx / 2, y - 8);
  ctx.textAlign = "left";
  ctx.restore();
}

function streetGrid(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const rnd = mulberry32(seed);
  let x = 0;
  while (x < w) {
    const gap = 22 + rnd() * 26;
    x += gap;
    ctx.strokeStyle = `rgba(255,255,255,${rnd() > 0.8 ? 0.14 : 0.06})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  let y = 0;
  while (y < h) {
    const gapY = 20 + rnd() * 24;
    y += gapY;
    ctx.strokeStyle = `rgba(255,255,255,${rnd() > 0.8 ? 0.14 : 0.06})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function lineGrid(ctx: CanvasRenderingContext2D, w: number, h: number, spacing: number, alpha: number) {
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function analogClock(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const r1 = i % 3 === 0 ? r * 0.78 : r * 0.86;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.stroke();
  }
  const now = new Date();
  const hourAngle = ((now.getHours() % 12 + now.getMinutes() / 60) / 12) * TAU - Math.PI / 2;
  const minAngle = (now.getMinutes() / 60) * TAU - Math.PI / 2;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * r * 0.5, y + Math.sin(hourAngle) * r * 0.5);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(minAngle) * r * 0.75, y + Math.sin(minAngle) * r * 0.75);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 1.6, 0, TAU);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();
}

function radarCell(ctx: CanvasRenderingContext2D, x: number, y: number, baseR: number, t: number, phase: number) {
  const wob = 1 + 0.06 * Math.sin(t * 0.4 + phase);
  glowDot(ctx, x, y, baseR * 1.6 * wob, 0.16, "120,196,150");
  glowDot(ctx, x + 4, y - 3, baseR * 1.05 * wob, 0.18, "224,196,96");
  glowDot(ctx, x - 2, y + 2, baseR * 0.55 * wob, 0.22, "205,92,84");
}

function feedIcon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI * 0.5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.55, -Math.PI * 0.5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 1.4, 0, TAU);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fill();
  ctx.restore();
}

function envelopeIcon(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number) {
  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h * 0.62);
  ctx.lineTo(x + w, y);
  ctx.stroke();
  ctx.restore();
}

export type ProductSceneMode = "cobalt" | "boreas" | "cypher" | "nightwatch";

interface SceneApi<S> {
  init: (w: number, h: number) => S;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, state: S) => void;
}

// ---------------------------------------------------------------- COBALT

interface CobaltState {
  aor: Point[];
  storm: Point;
  seismic: Point;
  volcano: Point;
  wave: Point;
  infra: Point[];
}

const cobalt: SceneApi<CobaltState> = {
  init: (w, h) => ({
    aor: [
      { x: w * 0.06, y: h * 0.16 },
      { x: w * 0.46, y: h * 0.07 },
      { x: w * 0.6, y: h * 0.4 },
      { x: w * 0.42, y: h * 0.7 },
      { x: w * 0.1, y: h * 0.6 },
    ],
    storm: { x: w * 0.28, y: h * 0.42 },
    seismic: { x: w * 0.66, y: h * 0.26 },
    volcano: { x: w * 0.82, y: h * 0.58 },
    wave: { x: w * 0.2, y: h * 0.82 },
    infra: [
      { x: w * 0.52, y: h * 0.52 },
      { x: w * 0.62, y: h * 0.44 },
      { x: w * 0.5, y: h * 0.36 },
    ],
  }),
  draw: (ctx, w, h, t, s) => {
    ctx.clearRect(0, 0, w, h);
    coordGrid(ctx, w, h, { lon: -118.1, lat: 34.15 }, 0.05, 7, 4);

    for (let c = 0; c < 6; c++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = h * (0.06 + c * 0.16) + Math.sin(x * 0.014 + c * 2.3 + t * 0.1) * 12 + Math.sin(x * 0.05 + c) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255,255,255,${0.1 - c * 0.008})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    dashedPolygon(ctx, s.aor, 0.3);

    for (let i = 0; i < 3; i++) {
      const a = t * 0.15 + i * 2.4;
      radarCell(ctx, s.storm.x + Math.cos(a) * 10, s.storm.y + Math.sin(a) * 10, 16 + i * 5, t, i * 1.7);
    }
    const sweep = (t * 0.4) % TAU;
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(s.storm.x, s.storm.y, 44, sweep, sweep + 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s.storm.x, s.storm.y, 44, 0, TAU);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    pingRings(ctx, s.seismic.x, s.seismic.y, t, 2.4, 46, "196,106,94", 2);
    glowDot(ctx, s.seismic.x, s.seismic.y, 6, 0.6, "196,106,94");

    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(s.volcano.x, s.volcano.y - 16);
    ctx.lineTo(s.volcano.x + 14, s.volcano.y + 10);
    ctx.lineTo(s.volcano.x - 14, s.volcano.y + 10);
    ctx.closePath();
    ctx.stroke();
    glowDot(ctx, s.volcano.x, s.volcano.y - 16, 6 + Math.sin(t * 2) * 2, 0.5, "230,140,80");

    ctx.beginPath();
    for (let wx = -10; wx <= 40; wx += 2) {
      const wy = s.wave.y + Math.sin(wx * 0.3 + t * 2) * 4;
      if (wx === -10) ctx.moveTo(s.wave.x + wx, wy);
      else ctx.lineTo(s.wave.x + wx, wy);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    for (let n = 0; n < s.infra.length; n++) {
      const node = s.infra[n]!;
      if (n > 0) {
        const prev = s.infra[n - 1]!;
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

    compassRose(ctx, w - 34, h - 40, 13);
    scaleBar(ctx, 16, 26, 60, "50 km");
  },
};

// ---------------------------------------------------------------- BOREAS

interface BoreasRoute {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}
interface BoreasRegion {
  pts: Point[];
  color: string;
}
interface BoreasState {
  routes: BoreasRoute[];
  threats: { x: number; y: number; r: number }[];
  regions: BoreasRegion[];
  tags: string[];
}

const boreas: SceneApi<BoreasState> = {
  init: (w, h) => {
    const routes: BoreasRoute[] = [
      { p0: { x: -w * 0.05, y: h * 0.3 }, p1: { x: w * 0.25, y: h * 0.05 }, p2: { x: w * 0.55, y: h * 0.5 }, p3: { x: w * 0.9, y: h * 0.22 } },
      { p0: { x: w * 0.05, y: h * 0.85 }, p1: { x: w * 0.35, y: h * 0.55 }, p2: { x: w * 0.6, y: h * 0.9 }, p3: { x: w * 1.02, y: h * 0.6 } },
      { p0: { x: -w * 0.02, y: h * 0.6 }, p1: { x: w * 0.3, y: h * 0.75 }, p2: { x: w * 0.65, y: h * 0.15 }, p3: { x: w * 0.95, y: h * 0.05 } },
    ];
    const rawRegions: { pts: [number, number][]; color: string }[] = [
      { pts: [[0.02, 0.05], [0.32, 0.02], [0.4, 0.28], [0.22, 0.42], [0.0, 0.32]], color: "111,174,130" },
      { pts: [[0.42, 0.3], [0.72, 0.18], [0.82, 0.45], [0.6, 0.6], [0.4, 0.5]], color: "207,159,82" },
      { pts: [[0.55, 0.62], [0.85, 0.55], [0.98, 0.85], [0.68, 0.98], [0.5, 0.85]], color: "196,106,94" },
    ];
    return {
      routes,
      threats: [{ x: w * 0.62, y: h * 0.55, r: 40 }],
      regions: rawRegions.map((r) => ({ pts: r.pts.map(([x, y]) => ({ x: x * w, y: y * h })), color: r.color })),
      tags: ["FL340 · 480kt", "FL290 · 460kt", "FL410 · 510kt"],
    };
  },
  draw: (ctx, w, h, t, s) => {
    ctx.clearRect(0, 0, w, h);
    coordGrid(ctx, w, h, { lon: 82, lat: 12 }, 6, 6, 4);

    s.regions.forEach((reg) => {
      ctx.beginPath();
      reg.pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.fillStyle = `rgba(${reg.color},0.09)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${reg.color},0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    s.threats.forEach((th) => {
      glowDot(ctx, th.x, th.y, th.r, 0.16, "196,106,94");
      pingRings(ctx, th.x, th.y, t, 2.6, th.r * 1.2, "196,106,94", 2);
    });

    s.routes.forEach((r, i) => {
      ctx.beginPath();
      for (let k = 0; k <= 60; k++) {
        const p = cubicPoint(r.p0, r.p1, r.p2, r.p3, k / 60);
        if (k === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([1, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      drawPin(ctx, r.p0.x < 0 ? 8 : r.p0.x, Math.max(8, r.p0.y), 5);
      drawPin(ctx, Math.min(w - 8, r.p3.x), r.p3.y, 5);

      const prog = ((t * (0.05 + i * 0.015)) + i * 0.3) % 1;
      const pt = cubicPoint(r.p0, r.p1, r.p2, r.p3, prog);
      const ahead = cubicPoint(r.p0, r.p1, r.p2, r.p3, Math.min(1, prog + 0.01));
      const heading = Math.atan2(ahead.y - pt.y, ahead.x - pt.x);
      drawPlane(ctx, pt.x, pt.y, heading, 9);

      ctx.font = "8.5px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(s.tags[i] ?? "", pt.x + 9, pt.y - 7);
    });

    compassRose(ctx, w - 34, h - 40, 13);
    scaleBar(ctx, 16, 26, 60, "500 km");
  },
};

// ---------------------------------------------------------------- CYPHER

interface CypherState {
  nodes: Point[];
  edges: [number, number][];
  target: Point;
}

const cypher: SceneApi<CypherState> = {
  init: (w, h) => {
    const rnd = mulberry32(21);
    const nodes: Point[] = [];
    for (let i = 0; i < 5; i++) nodes.push({ x: w * (0.15 + rnd() * 0.7), y: h * (0.35 + rnd() * 0.4) });
    return {
      nodes,
      edges: [[0, 1], [1, 2], [2, 3], [1, 4]],
      target: { x: w * 0.5, y: h * 0.42 },
    };
  },
  draw: (ctx, w, h, t, s) => {
    ctx.clearRect(0, 0, w, h);
    streetGrid(ctx, w, h, 24);

    s.edges.forEach((e) => {
      const a = s.nodes[e[0]]!;
      const b = s.nodes[e[1]]!;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 8, b.x, b.y);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    s.nodes.forEach((n) => {
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(n.x - 5, n.y - 5, 10, 10);
    });

    const cx = s.target.x;
    const cy = s.target.y;
    const period = 3;
    const phase = (t % period) / period;
    const close = phase < 0.7 ? easeInOut(phase / 0.7) : 1;
    const ringLabels = ["1km", "500m", "250m"];
    for (let ring = 0; ring < 3; ring++) {
      const baseR = 70 - ring * 14;
      const r = baseR - close * (baseR - (26 + ring * 8));
      ctx.strokeStyle = `rgba(255,255,255,${0.4 - ring * 0.08})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, ring * 0.6 + t * 0.12, ring * 0.6 + t * 0.12 + TAU * 0.72);
      ctx.stroke();
      ctx.font = "8px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillText(ringLabels[ring]!, cx + r * 0.7, cy - r * 0.7);
    }
    drawPin(ctx, cx, cy + 6, 11);

    compassRose(ctx, w - 30, 62, 11);
  },
};

// ------------------------------------------------------------ NIGHTWATCH

interface NightwatchSource {
  y: number;
  trust: number;
  label: string;
  color: string;
}
interface NightwatchState {
  sources: NightwatchSource[];
}

const nightwatch: SceneApi<NightwatchState> = {
  init: (w, h) => ({
    sources: [
      { y: h * 0.24, trust: 0.92, label: "WIRE SERVICE", color: "111,174,130" },
      { y: h * 0.42, trust: 0.78, label: "REGIONAL NEWS", color: "207,159,82" },
      { y: h * 0.6, trust: 0.64, label: "FIELD REPORT", color: "207,159,82" },
      { y: h * 0.78, trust: 0.55, label: "PARTNER FEED", color: "196,106,94" },
    ],
  }),
  draw: (ctx, w, h, t, s) => {
    ctx.clearRect(0, 0, w, h);
    lineGrid(ctx, w, h, 22, 0.05);

    const colX = w * 0.08;
    const colW = w * 0.27;
    const docX = w * 0.56;
    const docW = w * 0.36;
    const docY = h * 0.16;
    const docH = h * 0.68;
    const headerH = docH * 0.24;
    const rowH = (docH - headerH) / s.sources.length;
    const rowY = (i: number) => docY + headerH + rowH * (i + 0.5);

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.3;
    ctx.strokeRect(docX, docY, docW, docH);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(docX, docY, docW, docH);

    envelopeIcon(ctx, docX + 12, docY + 10, 15, 10, 0.55);
    ctx.font = "600 10px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("DAILY BRIEF", docX + 34, docY + 19);
    ctx.beginPath();
    ctx.moveTo(docX + 10, docY + headerH);
    ctx.lineTo(docX + docW - 10, docY + headerH);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // each outlet's packet is colored to its own reliability tier and
    // travels to its own numbered row, so it reads as "this feed becomes
    // this line" rather than everything blurring into one inbox.
    s.sources.forEach((src, i) => {
      const ty = rowY(i);
      const prog = ((t * 0.22) + i * (1 / s.sources.length)) % 1;
      const pulse = Math.max(0, 1 - Math.abs(prog - 0.94) * 22);

      ctx.beginPath();
      ctx.moveTo(colX + colW, src.y);
      ctx.lineTo((colX + colW + docX) / 2, src.y);
      ctx.lineTo(docX, ty);
      ctx.strokeStyle = `rgba(${src.color},${0.4 + pulse * 0.45})`;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(colX, src.y - 10, colW, 22);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(colX, src.y - 10, colW, 22);

      feedIcon(ctx, colX + 10, src.y - 2, 4.5, 0.5);
      ctx.font = "8px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(src.label, colX + 19, src.y - 1);
      ctx.fillStyle = `rgba(${src.color},0.9)`;
      ctx.beginPath();
      ctx.arc(colX + colW - 8, src.y - 2, 2, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(colX + 6, src.y + 5, colW * 0.75 * src.trust, 2.5);

      const midx = lerp(colX + colW, (colX + colW + docX) / 2, clamp01(prog * 2));
      const x = prog < 0.5 ? midx : lerp((colX + colW + docX) / 2, docX, clamp01((prog - 0.5) * 2));
      const y = prog < 0.5 ? src.y : lerp(src.y, ty, clamp01((prog - 0.5) * 2));
      glowDot(ctx, x, y, 5, Math.sin(prog * Math.PI) * 0.9, src.color);

      ctx.font = "8px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillText("0" + (i + 1), docX + 10, ty - 5);
      ctx.fillStyle = `rgba(${src.color},${0.55 + pulse * 0.45})`;
      ctx.beginPath();
      ctx.arc(docX + 27, ty - 8, 2, 0, TAU);
      ctx.fill();

      // a headline bar plus two shorter, dimmer lines beneath read as an
      // ingested summary rather than a single stat, without spelling out
      // fake copy — width varies per row so the block feels like text.
      const blockX = docX + 34;
      const maxW = docW - 48;
      const headW = maxW * (0.72 + 0.14 * Math.sin(i * 2.3 + 1));
      const lineW1 = headW * 0.8;
      const lineW2 = headW * 0.52;
      ctx.fillStyle = `rgba(255,255,255,${0.34 + pulse * 0.5})`;
      ctx.fillRect(blockX, ty - 9, headW, 3);
      ctx.fillStyle = `rgba(255,255,255,${0.17 + pulse * 0.3})`;
      ctx.fillRect(blockX, ty, lineW1, 2);
      ctx.fillStyle = `rgba(255,255,255,${0.11 + pulse * 0.22})`;
      ctx.fillRect(blockX, ty + 7, lineW2, 2);

      // provenance tag: ties the summary block back to its source's color
      ctx.fillStyle = `rgba(${src.color},${0.3 + pulse * 0.5})`;
      ctx.fillRect(docX + docW - 14, ty - 9, 3, 18);

      if (i < s.sources.length - 1) {
        ctx.beginPath();
        ctx.moveTo(docX + 10, ty + rowH / 2);
        ctx.lineTo(docX + docW - 10, ty + rowH / 2);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    analogClock(ctx, w - 34, h - 40, 13);
  },
};

export const productSceneModes: Record<ProductSceneMode, SceneApi<any>> = {
  cobalt,
  boreas,
  cypher,
  nightwatch,
};
