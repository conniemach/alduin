import { useEffect } from "react";
import continentOutlineData from "./continent-outlines.json";

/**
 * Renders the hero's globe background: camera fixed at the center of a
 * unit sphere, coastlines from Natural Earth 10m land polygons (~6,800
 * vertices across 149 landmasses/islands), an equidistant fisheye
 * projection (screen radius ∝ angle off-axis — bounded and smooth, no
 * rectilinear-perspective singularity at the horizon), animated signal
 * pulses beaming from the surface toward the viewer, and periodic
 * "alert" pings that reveal a data-point callout in sequence (marker ->
 * leader line grows out -> callout box unfurls -> tick marks fade in).
 *
 * Defaults (rotation speed, zoom, starting orientation) match the
 * approved concept exactly; there's no exposed UI for tuning them here.
 */

type Vec3 = { x: number; y: number; z: number };
type Projected = { px: number; py: number; theta: number; visible: boolean };

const DEG = Math.PI / 180;

function lonLatToXYZ(lonDeg: number, latDeg: number): Vec3 {
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  return {
    x: Math.cos(lat) * Math.cos(lon),
    y: Math.sin(lat),
    z: Math.cos(lat) * Math.sin(lon),
  };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function normalize(v: Vec3): Vec3 {
  const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

function smoothstepClamp(x: number, a: number, b: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Equidistant fisheye, not rectilinear perspective. A rectilinear camera
// (screen pos ∝ x/z) has a singularity at the horizon, so anything
// approaching it stretches and spikes without bound. Mapping screen
// radius directly to angle off-axis instead keeps the whole dome inside
// a fixed, smooth circle no matter how far the camera rotates.
const MAX_THETA = 2.1; // ~120° off-axis before culling — a bit past the horizon
const CORE_FADE_THETA = 1.5; // ~86° — full brightness inside this, fades out beyond it

const BASE_SPEED = 0.11; // rad/sec
const SPEED_MUL = 0.7;
const START_YAW = 0.6;
const START_PITCH = -0.18;

const MAX_PULSES = 46;
const MAX_PINGS = 9;

interface Pulse {
  x: number;
  y: number;
  z: number;
  r0: number;
  r1: number;
  t: number;
  dur: number;
  delay: number;
}

interface Ping {
  center: Vec3;
  e1: Vec3;
  e2: Vec3;
  t: number;
  dur: number;
  maxTheta: number;
  delay: number;
  dpSize: number;
  leaderDir: { x: number; y: number };
  leaderLen: number;
  boxW: number;
  boxH: number;
  nLines: number;
  lineWidthFracs: number[];
}

const LEADER_DIRS = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

// The ping's data-point callout reveals in stages, all as absolute
// seconds off pg.t (not fractions of pg.dur) so the hold time below
// stays exactly what it says regardless of the random overall duration.
// The alert flash ring is intentionally on its OWN clock (RING_DUR) —
// it should stay quick and tight even though the callout now lingers.
const RING_DUR = 0.7;
const MARKER_START = 0.1;
const MARKER_END = 0.32;
const LINE_END = 0.52;
const BOX_END = 0.72;
const TICK_START = 0.62;
const TICK_END = 0.88;
const HOLD_SECONDS = 2.0; // was disappearing almost immediately after appearing
const HOLD_END = TICK_END + HOLD_SECONDS;
const FADE_SECONDS = 0.5;
const FADE_END = HOLD_END + FADE_SECONDS;

export function useFisheyeGlobe(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const continentOutlines: Vec3[][] = Object.values(
      continentOutlineData as unknown as Record<string, [number, number][]>,
    ).map((ring) => ring.map(([lon, lat]) => lonLatToXYZ(lon, lat)));

    const surfacePoints: Vec3[] = [];
    for (const poly of continentOutlines) {
      for (let i = 0; i < poly.length - 1; i++) surfacePoints.push(poly[i]!);
    }

    // Latitude rings + longitude meridians for the HUD wireframe feel.
    const gridLines: Vec3[][] = [];
    const latSteps = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
    const SEG = 90;
    for (const latDeg of latSteps) {
      const lat = latDeg * DEG;
      const ring: Vec3[] = [];
      for (let s = 0; s <= SEG; s++) {
        const lon = (s / SEG) * Math.PI * 2;
        ring.push({
          x: Math.cos(lat) * Math.cos(lon),
          y: Math.sin(lat),
          z: Math.cos(lat) * Math.sin(lon),
        });
      }
      gridLines.push(ring);
    }
    const lonSteps = Array.from({ length: 24 }, (_, i) => i * 15);
    for (const lonDeg of lonSteps) {
      const lon = lonDeg * DEG;
      const merid: Vec3[] = [];
      for (let s = 0; s <= SEG; s++) {
        const lat = -Math.PI / 2 + (s / SEG) * Math.PI;
        merid.push({
          x: Math.cos(lat) * Math.cos(lon),
          y: Math.sin(lat),
          z: Math.cos(lat) * Math.sin(lon),
        });
      }
      gridLines.push(merid);
    }

    // Signal pulses: fire from a land point (r=1) inward toward the
    // camera (r≈0.05), then respawn elsewhere — "data coming out of"
    // the surface toward the viewer.
    function spawnPulse(p: Pulse) {
      const src = surfacePoints[(Math.random() * surfacePoints.length) | 0]!;
      p.x = src.x;
      p.y = src.y;
      p.z = src.z;
      p.r0 = 1.0;
      p.r1 = 0.06 + Math.random() * 0.05;
      p.t = 0;
      p.dur = 1.3 + Math.random() * 1.6;
      p.delay = Math.random() * 1.4;
    }
    const pulses: Pulse[] = [];
    for (let i = 0; i < MAX_PULSES; i++) {
      const pulse = {} as Pulse;
      spawnPulse(pulse);
      pulse.delay = Math.random() * 3;
      pulses.push(pulse);
    }

    // Pings: a quick "alert" flash ring plus a data-point callout that
    // reveals in sequence (marker -> leader line -> flag -> tick marks).
    function spawnPing(pg: Ping) {
      const src = surfacePoints[(Math.random() * surfacePoints.length) | 0]!;
      pg.center = { x: src.x, y: src.y, z: src.z };
      const up: Vec3 =
        Math.abs(src.y) < 0.98
          ? { x: 0, y: 1, z: 0 }
          : { x: 1, y: 0, z: 0 };
      pg.e1 = normalize(cross(pg.center, up));
      pg.e2 = cross(pg.center, pg.e1);
      pg.t = 0;
      // FADE_END plus a little jitter so pings don't all cycle in lockstep
      pg.dur = FADE_END + Math.random() * 0.6;
      pg.maxTheta = 0.045 + Math.random() * 0.03;
      pg.delay = Math.random() * 2.2;
      pg.dpSize = 2.2 + Math.random() * 1.2;
      pg.leaderDir = LEADER_DIRS[(Math.random() * LEADER_DIRS.length) | 0]!;
      pg.leaderLen = 22 + Math.random() * 16;
      pg.boxW = 34 + Math.random() * 18;
      pg.boxH = 11 + Math.random() * 5;
      pg.nLines = 2 + ((Math.random() * 2) | 0);
      pg.lineWidthFracs = Array.from({ length: pg.nLines }, (_, i) =>
        i === pg.nLines - 1 ? 0.45 + Math.random() * 0.2 : 0.75 + Math.random() * 0.2,
      );
    }
    const pings: Ping[] = [];
    for (let i = 0; i < MAX_PINGS; i++) {
      const ping = {} as Ping;
      spawnPing(ping);
      pings.push(ping);
    }

    let yaw = START_YAW;
    const pitch = START_PITCH;

    function rotatePoint(p: Vec3): Vec3 {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const rx = p.x * cosY + p.z * sinY;
      const rz = -p.x * sinY + p.z * cosY;
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const ry = p.y * cosP - rz * sinP;
      const rz2 = p.y * sinP + rz * cosP;
      return { x: rx, y: ry, z: rz2 };
    }

    function depthT(theta: number): number {
      return 1 - smoothstepClamp(theta, CORE_FADE_THETA, MAX_THETA);
    }

    let W = 0;
    let H = 0;
    let scaleBase = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Pixels per radian, based on the hero's WIDTH rather than its
      // shorter side — the hero is a short, very wide banner, and
      // basing scale on width is what makes the globe reach edge to
      // edge regardless of how wide the window is (a height-based
      // scale would stay a fixed size and leave gutters on a wide
      // window). The canvas itself was already spanning the full
      // width — this constant is what controls how much of that width
      // the visible (still-bright) globe content reaches before its
      // own fade starts, as opposed to just fading out around the
      // midpoint. 0.3 puts CORE_FADE_THETA's radius at ~90% of the
      // width (full brightness almost to the CSS edge-fade band) and
      // MAX_THETA past the edge entirely, so content is still genuinely
      // bright when the CSS vignette starts tapering it.
      scaleBase = W * 0.3;
    }
    resize();

    function project(rp: Vec3): Projected {
      const sinTheta = Math.sqrt(rp.x * rp.x + rp.y * rp.y);
      const theta = Math.atan2(sinTheta, rp.z);
      const dx = sinTheta > 1e-6 ? rp.x / sinTheta : 0;
      const dy = sinTheta > 1e-6 ? rp.y / sinTheta : 0;
      const r = theta * scaleBase;
      return {
        px: W / 2 + dx * r,
        py: H / 2 + dy * r,
        theta,
        visible: theta < MAX_THETA,
      };
    }

    let last = performance.now();
    let frameId = 0;

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!reducedMotion) {
        yaw += BASE_SPEED * SPEED_MUL * dt;
      }

      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighten";

      // grid wireframe
      ctx!.lineWidth = 1;
      for (const line of gridLines) {
        ctx!.beginPath();
        let open = false;
        for (const point of line) {
          const proj = project(rotatePoint(point));
          if (!proj.visible) {
            open = false;
            continue;
          }
          if (!open) {
            ctx!.moveTo(proj.px, proj.py);
            open = true;
          } else {
            ctx!.lineTo(proj.px, proj.py);
          }
        }
        ctx!.strokeStyle = "rgba(255,255,255,0.4)";
        ctx!.stroke();
      }

      // continent outlines — pure line art, no fill. Alpha is computed
      // per segment from that segment's own angle off-axis (not
      // averaged across a whole landmass) so a coastline genuinely
      // fades out as it nears the edge instead of getting hard-culled
      // mid-brightness. Segments are grouped into alpha buckets so this
      // is still only ~12 stroke() calls total, not one per segment.
      ctx!.lineWidth = 1.4;
      ctx!.lineJoin = "round";
      const COAST_BUCKETS = 12;
      const coastBuckets = new Map<number, number[]>();
      for (const poly of continentOutlines) {
        const proj = poly.map((v) => project(rotatePoint(v)));
        for (let i = 0; i < proj.length - 1; i++) {
          const pA = proj[i]!;
          const pB = proj[i + 1]!;
          if (!pA.visible || !pB.visible) continue;
          // no "+ floor" term here on purpose: depthT alone runs 1 -> 0
          // smoothly, so a segment is already near-zero alpha by the
          // time it's close to the hard cull.
          const segAlpha = 0.95 * depthT((pA.theta + pB.theta) / 2);
          const bucket = Math.round(segAlpha * COAST_BUCKETS);
          if (bucket <= 0) continue;
          const arr = coastBuckets.get(bucket) ?? [];
          arr.push(pA.px, pA.py, pB.px, pB.py);
          coastBuckets.set(bucket, arr);
        }
      }
      coastBuckets.forEach((pts, bucket) => {
        ctx!.beginPath();
        for (let i = 0; i < pts.length; i += 4) {
          ctx!.moveTo(pts[i]!, pts[i + 1]!);
          ctx!.lineTo(pts[i + 2]!, pts[i + 3]!);
        }
        ctx!.strokeStyle = `rgba(255,255,255,${(bucket / COAST_BUCKETS).toFixed(3)})`;
        ctx!.stroke();
      });

      // pings: a quick alert flash plus a data-point callout that
      // reveals in sequence (marker -> leader line grows out -> the
      // callout box unfurls like a flag -> fake data ticks fade in).
      for (const pg of pings) {
        if (pg.delay > 0) {
          pg.delay -= dt;
          continue;
        }
        pg.t += dt;
        if (pg.t >= pg.dur) {
          spawnPing(pg);
          continue;
        }
        // the alert flash runs on its own short clock, independent of
        // how long the data-point callout below ends up lingering for
        const ringU = Math.min(1, pg.t / RING_DUR);
        const theta = pg.maxTheta * (1 - Math.pow(1 - ringU, 2));
        const ringAlpha = (1 - ringU) * 0.75;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const N = 24;
        ctx!.beginPath();
        let openR = false;
        for (let s = 0; s <= N; s++) {
          const phi = (s / N) * Math.PI * 2;
          const cosP2 = Math.cos(phi);
          const sinP2 = Math.sin(phi);
          const local: Vec3 = {
            x: pg.center.x * cosT + (pg.e1.x * cosP2 + pg.e2.x * sinP2) * sinT,
            y: pg.center.y * cosT + (pg.e1.y * cosP2 + pg.e2.y * sinP2) * sinT,
            z: pg.center.z * cosT + (pg.e1.z * cosP2 + pg.e2.z * sinP2) * sinT,
          };
          const projR = project(rotatePoint(local));
          if (!projR.visible) {
            openR = false;
            continue;
          }
          if (!openR) {
            ctx!.moveTo(projR.px, projR.py);
            openR = true;
          } else {
            ctx!.lineTo(projR.px, projR.py);
          }
        }
        ctx!.lineWidth = 1.2;
        ctx!.strokeStyle = `rgba(255,255,255,${ringAlpha.toFixed(3)})`;
        ctx!.stroke();

        const markerT = smoothstepClamp(pg.t, MARKER_START, MARKER_END);
        const lineT = smoothstepClamp(pg.t, MARKER_END, LINE_END);
        const boxT = smoothstepClamp(pg.t, LINE_END, BOX_END);
        const tickT = smoothstepClamp(pg.t, TICK_START, TICK_END);
        const popOut = 1 - smoothstepClamp(pg.t, HOLD_END, FADE_END);
        const dpAlpha = markerT * popOut;
        if (dpAlpha <= 0.02) continue;

        const projC = project(rotatePoint(pg.center));
        if (!projC.visible) continue;
        const finalAlpha = dpAlpha * depthT(projC.theta);
        if (finalAlpha <= 0.02) continue;

        const overshoot = 1 + (1 - markerT) * 0.9;
        const core = pg.dpSize * (0.55 + 0.45 * markerT) * overshoot;

        ctx!.save();
        ctx!.shadowColor = "rgba(255,255,255,0.95)";
        ctx!.shadowBlur = 7;
        ctx!.beginPath();
        ctx!.arc(projC.px, projC.py, core, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${finalAlpha.toFixed(3)})`;
        ctx!.fill();
        ctx!.restore();

        ctx!.lineWidth = 1;
        ctx!.strokeStyle = `rgba(255,255,255,${(finalAlpha * 0.75).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(projC.px, projC.py, core * 2.6, 0, Math.PI * 2);
        ctx!.stroke();

        const dx = pg.leaderDir.x;
        const dy = pg.leaderDir.y;

        if (lineT > 0.001) {
          const curLen = pg.leaderLen * lineT;
          ctx!.strokeStyle = `rgba(255,255,255,${(finalAlpha * 0.55).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.moveTo(projC.px, projC.py);
          ctx!.lineTo(projC.px + dx * curLen, projC.py + dy * curLen);
          ctx!.stroke();
        }

        if (boxT > 0.001) {
          const endX = projC.px + dx * pg.leaderLen;
          const endY = projC.py + dy * pg.leaderLen;
          const curBoxW = pg.boxW * boxT;
          const boxX = dx >= 0 ? endX : endX - curBoxW;
          const boxY = endY - pg.boxH / 2;
          ctx!.strokeStyle = `rgba(255,255,255,${(finalAlpha * 0.6).toFixed(3)})`;
          ctx!.strokeRect(boxX, boxY, curBoxW, pg.boxH);

          // fake data as a greeked-text mockup: a couple of horizontal
          // bars stacked like lines of copy, the last one shorter, the
          // same convention as any wireframe's placeholder text block
          if (tickT > 0.001 && curBoxW > 8) {
            ctx!.lineWidth = 1.4;
            ctx!.strokeStyle = `rgba(255,255,255,${(finalAlpha * 0.5 * tickT).toFixed(3)})`;
            ctx!.beginPath();
            const pad = 4;
            const rowPad = 2;
            const innerW = Math.max(0, curBoxW - pad * 2);
            const rowH = (pg.boxH - rowPad * 2) / pg.nLines;
            for (let row = 0; row < pg.nLines; row++) {
              const rowY = boxY + rowPad + rowH * (row + 0.5);
              const rowW = innerW * pg.lineWidthFracs[row]!;
              ctx!.moveTo(boxX + pad, rowY);
              ctx!.lineTo(boxX + pad + rowW, rowY);
            }
            ctx!.stroke();
          }
        }
      }

      // signal pulses: surface -> viewer, with a faint beam behind the head
      for (const pu of pulses) {
        if (pu.delay > 0) {
          pu.delay -= dt;
          continue;
        }
        pu.t += dt;
        if (pu.t >= pu.dur) {
          spawnPulse(pu);
          continue;
        }
        const u = pu.t / pu.dur;
        const eased = 1 - Math.pow(1 - u, 3);
        const r = pu.r0 + (pu.r1 - pu.r0) * eased;
        const head: Vec3 = { x: pu.x * r, y: pu.y * r, z: pu.z * r };
        const rTail = Math.min(pu.r0, r + 0.12);
        const tail: Vec3 = { x: pu.x * rTail, y: pu.y * rTail, z: pu.z * rTail };

        const projHead = project(rotatePoint(head));
        if (!projHead.visible) continue;
        const tHead = depthT(projHead.theta);
        const projTailRaw = project(rotatePoint(tail));
        const projTail = projTailRaw.visible ? projTailRaw : projHead;

        const fadeIn = Math.min(1, u * 6);
        const fadeOut = 1 - Math.max(0, (u - 0.82) / 0.18);
        const pulseAlpha = Math.pow(tHead, 1.2) * fadeIn * fadeOut;
        if (pulseAlpha <= 0.01) continue;

        ctx!.beginPath();
        ctx!.moveTo(projTail.px, projTail.py);
        ctx!.lineTo(projHead.px, projHead.py);
        ctx!.strokeStyle = `rgba(255,255,255,${(pulseAlpha * 0.35).toFixed(3)})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        const headSize = 1.1 + (1 - r) * 2.2;
        ctx!.save();
        ctx!.shadowColor = "rgba(255,255,255,0.9)";
        ctx!.shadowBlur = 6 + (1 - r) * 10;
        ctx!.beginPath();
        ctx!.arc(projHead.px, projHead.py, headSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${pulseAlpha.toFixed(3)})`;
        ctx!.fill();
        ctx!.restore();
      }

      ctx!.globalCompositeOperation = "source-over";
      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [canvasRef, containerRef]);
}
