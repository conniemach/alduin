import { useEffect } from "react";
import continentOutlineData from "../hero-globe/continent-outlines.json";

/**
 * Renders the About hero's background: the same coastline dataset the
 * homepage globe uses, flattened to a flat equirectangular world map
 * (not cropped to a region — the whole globe, fit to whichever of the
 * container's width/height is more restrictive so it's always fully
 * visible at correct proportions) with a sonar-style ping broadcasting
 * from a fixed point, a handful of status-colored contact markers, and
 * occasional data-point callouts. Landed on after a few rounds of
 * exploration: a pure radial sweep read as an orbit/star-chart
 * diagram no matter how it was styled, and grounding the same "ping"
 * mechanic on real, correctly-rendered terrain fixed that outright.
 */

type LonLat = [number, number];

// Latitude trimmed to -58/+80 — drops Antarctica's long pointed tail
// and the mostly-empty Arctic past Greenland, the same trim most
// illustrated (non-polar-research) world maps use, so the inhabited
// continents aren't squeezed smaller than they need to be.
const LON0 = -180;
const LON1 = 180;
const LAT0 = -58;
const LAT1 = 80;
const LON_RANGE = LON1 - LON0;
const LAT_RANGE = LAT1 - LAT0;

const GOOD = "111,174,130";
const WARN = "207,159,82";
const CRIT = "196,106,94";
const SIGNAL = "150,255,190";
const STATUS_COLORS = [GOOD, GOOD, GOOD, WARN, WARN, CRIT];

const N_CONTACTS = 6;
const PULSE_INTERVAL_S = 2.6;
const PING_DUR_S = 2.6;
const MAX_CONCURRENT_PINGS = 2;

interface Contact {
  u: number;
  v: number;
  rgb: string;
  lastHit: number;
  flash: number;
}

interface Ping {
  contact: Contact;
  t: number;
}

interface Pulse {
  t: number;
}

function project(lon: number, lat: number): [number, number] {
  const u = (lon - LON0) / LON_RANGE;
  const v = 1 - (lat - LAT0) / LAT_RANGE;
  return [u, v];
}

export function useGroundedMap(
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

    const coastlines: LonLat[][] = Object.values(
      continentOutlineData as unknown as Record<string, LonLat[]>,
    );

    const glowSize = 96;
    const glowSprite = document.createElement("canvas");
    glowSprite.width = glowSprite.height = glowSize;
    const glowCtx = glowSprite.getContext("2d")!;
    const glowGradient = glowCtx.createRadialGradient(
      glowSize / 2,
      glowSize / 2,
      0,
      glowSize / 2,
      glowSize / 2,
      glowSize / 2,
    );
    glowGradient.addColorStop(0, `rgba(${SIGNAL},1)`);
    glowGradient.addColorStop(1, `rgba(${SIGNAL},0)`);
    glowCtx.fillStyle = glowGradient;
    glowCtx.fillRect(0, 0, glowSize, glowSize);
    function drawGlow(x: number, y: number, r: number, a: number) {
      if (a <= 0 || r <= 0) return;
      ctx!.globalAlpha = a;
      ctx!.drawImage(glowSprite, x - r, y - r, r * 2, r * 2);
      ctx!.globalAlpha = 1;
    }

    const contacts: Contact[] = Array.from({ length: N_CONTACTS }, () => ({
      u: 0.15 + Math.random() * 0.7,
      v: 0.15 + Math.random() * 0.7,
      rgb: STATUS_COLORS[(Math.random() * STATUS_COLORS.length) | 0]!,
      lastHit: -10,
      flash: 0,
    }));
    const pulses: Pulse[] = [];
    const pings: Ping[] = [];

    function drawContact(x: number, y: number, rgb: string, flash: number) {
      const s = 4.5 + flash * 2.5;
      ctx!.strokeStyle = `rgba(${rgb},${Math.min(1, 0.85 + flash * 0.15).toFixed(3)})`;
      ctx!.lineWidth = 1.2;
      ctx!.strokeRect(x - s / 2, y - s / 2, s, s);
      if (flash > 0.05) {
        ctx!.fillStyle = `rgba(${rgb},${(0.7 * flash * 0.6).toFixed(3)})`;
        ctx!.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }

    let W = 0;
    let H = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function mapBox() {
      // Fit whichever of width/height is more restrictive so the
      // whole ~2.6:1 world map is always visible at true proportions,
      // rather than bleeding off the canvas and only showing a
      // fragment of it.
      const ratio = LON_RANGE / LAT_RANGE;
      const availW = W * 0.62;
      const availH = H * 0.86;
      const boxW = Math.min(availW, availH * ratio);
      const boxH = boxW / ratio;
      return { x0: W * 0.97 - boxW, y0: H / 2 - boxH / 2, w: boxW, h: boxH };
    }

    function drawStatic() {
      const box = mapBox();
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighten";
      drawCoastlines(box);
      drawGraticule(box);
      for (const c of contacts) {
        drawContact(box.x0 + c.u * box.w, box.y0 + c.v * box.h, c.rgb, 0);
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function drawCoastlines(box: { x0: number; y0: number; w: number; h: number }) {
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(box.x0, box.y0, box.w, box.h);
      ctx!.clip();
      ctx!.lineWidth = 1.1;
      for (const poly of coastlines) {
        ctx!.beginPath();
        poly.forEach(([lon, lat], i) => {
          const [u, v] = project(lon, lat);
          const x = box.x0 + u * box.w;
          const y = box.y0 + v * box.h;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        });
        ctx!.closePath();
        ctx!.fillStyle = "rgba(120,150,190,0.08)";
        ctx!.fill();
        ctx!.strokeStyle = "rgba(255,255,255,0.42)";
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawGraticule(box: { x0: number; y0: number; w: number; h: number }) {
      ctx!.strokeStyle = "rgba(255,255,255,0.05)";
      ctx!.lineWidth = 1;
      for (let lon = Math.ceil(LON0 / 30) * 30; lon <= LON1; lon += 30) {
        const x = box.x0 + ((lon - LON0) / LON_RANGE) * box.w;
        ctx!.beginPath();
        ctx!.moveTo(x, box.y0);
        ctx!.lineTo(x, box.y0 + box.h);
        ctx!.stroke();
      }
      for (let lat = Math.ceil(LAT0 / 30) * 30; lat <= LAT1; lat += 30) {
        const y = box.y0 + (1 - (lat - LAT0) / LAT_RANGE) * box.h;
        ctx!.beginPath();
        ctx!.moveTo(box.x0, y);
        ctx!.lineTo(box.x0 + box.w, y);
        ctx!.stroke();
      }
      const eqY = box.y0 + (1 - (0 - LAT0) / LAT_RANGE) * box.h;
      ctx!.beginPath();
      ctx!.moveTo(box.x0, eqY);
      ctx!.lineTo(box.x0 + box.w, eqY);
      ctx!.strokeStyle = "rgba(255,255,255,0.09)";
      ctx!.stroke();
    }

    if (reducedMotion) {
      drawStatic();
      const ro = new ResizeObserver(() => {
        resize();
        drawStatic();
      });
      ro.observe(container);
      return () => ro.disconnect();
    }

    let last = performance.now();
    let frameId = 0;
    let nextPulse = 0.6;

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const box = mapBox();

      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighten";
      drawCoastlines(box);
      drawGraticule(box);

      // sonar pulse, broadcast from ~15°E 35°N (Southern Europe/
      // Mediterranean) — a fixed, plausible "command hub" location now
      // that the whole world is in view
      nextPulse -= dt;
      const boxMin = Math.min(box.w, box.h);
      const srcX = box.x0 + ((15 - LON0) / LON_RANGE) * box.w;
      const srcY = box.y0 + (1 - (35 - LAT0) / LAT_RANGE) * box.h;
      if (nextPulse <= 0) {
        pulses.push({ t: 0 });
        nextPulse = PULSE_INTERVAL_S + Math.random() * 0.6;
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i]!;
        pu.t += dt;
        const pr = pu.t * (boxMin * 0.34);
        if (pr > boxMin * 0.66) {
          pulses.splice(i, 1);
          continue;
        }
        const ringAlpha = Math.max(0, 0.45 * (1 - pr / (boxMin * 0.66)));
        ctx!.beginPath();
        ctx!.arc(srcX, srcY, pr, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${SIGNAL},${ringAlpha.toFixed(3)})`;
        ctx!.lineWidth = 1.6;
        ctx!.stroke();
        for (const c of contacts) {
          const cx = box.x0 + c.u * box.w;
          const cy = box.y0 + c.v * box.h;
          if (
            Math.abs(Math.hypot(cx - srcX, cy - srcY) - pr) < 10 &&
            t - c.lastHit > 1.5
          ) {
            c.lastHit = t;
            c.flash = 1;
            if (Math.random() < 0.5 && pings.length < MAX_CONCURRENT_PINGS) {
              pings.push({ contact: c, t: 0 });
            }
          }
        }
      }
      drawGlow(srcX, srcY, 16, 0.3);
      ctx!.beginPath();
      ctx!.arc(srcX, srcY, 2.2, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${SIGNAL},0.9)`;
      ctx!.fill();

      for (const c of contacts) {
        const cx = box.x0 + c.u * box.w;
        const cy = box.y0 + c.v * box.h;
        c.flash = Math.max(0, c.flash - dt * 0.9);
        drawContact(cx, cy, c.rgb, c.flash);
      }

      for (let i = pings.length - 1; i >= 0; i--) {
        const pg = pings[i]!;
        pg.t += dt;
        if (pg.t >= PING_DUR_S) {
          pings.splice(i, 1);
          continue;
        }
        const markerT = Math.min(1, pg.t / 0.3);
        const lineT = Math.min(1, Math.max(0, (pg.t - 0.3) / 0.3));
        const boxT = Math.min(1, Math.max(0, (pg.t - 0.6) / 0.3));
        const fadeOut = 1 - Math.min(1, Math.max(0, (pg.t - 1.9) / 0.7));
        const a = markerT * fadeOut;
        if (a <= 0.02) continue;
        const bx = box.x0 + pg.contact.u * box.w;
        const by = box.y0 + pg.contact.v * box.h;
        ctx!.fillStyle = `rgba(${SIGNAL},${a.toFixed(3)})`;
        ctx!.fillRect(bx - 2.5, by - 2.5, 5, 5);
        ctx!.strokeStyle = `rgba(${SIGNAL},${Math.min(1, a + 0.15).toFixed(3)})`;
        ctx!.lineWidth = 1;
        ctx!.strokeRect(bx - 4, by - 4, 8, 8);
        const dx = pg.contact.u >= 0.5 ? 1 : -1;
        const leaderLen = 24 * lineT;
        if (lineT > 0.01) {
          ctx!.beginPath();
          ctx!.moveTo(bx, by);
          ctx!.lineTo(bx + dx * leaderLen, by - 16 * lineT);
          ctx!.strokeStyle = `rgba(${SIGNAL},${(a * 0.6).toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
        if (boxT > 0.01) {
          const ex = bx + dx * 24;
          const ey = by - 16;
          const bw = 74 * boxT;
          const bh = 20;
          const boxX = dx > 0 ? ex : ex - bw;
          ctx!.strokeStyle = `rgba(${SIGNAL},${(a * 0.65).toFixed(3)})`;
          ctx!.strokeRect(boxX, ey - bh / 2, bw, bh);
        }
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
