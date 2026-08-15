import { useEffect } from "react";

/**
 * Renders the Problem/Solution panel's illustration: three independently
 * drifting waveforms (three scattered tools/data sources) that zip
 * together into a single line as the panel's real scroll progress
 * advances, closing from the right edge inward. Progress is read from a
 * ref every frame rather than passed as a prop or driven by its own
 * timer — that way the zip point's speed is a direct function of how
 * fast the user is actually scrolling (scroll fast, it zips fast; scroll
 * back up, it unzips) rather than playing out on a fixed schedule.
 */

// The same bold, saturated green used for the product marks' own glow
// (--product-mark-green in product-mark.css), not the muted
// --product-scene-good — this illustration's "fully resolved" state
// should read as the same brand glow as the Cobalt/Boreas/Nightwatch
// marks, not a status-indicator green.
const MARK_GREEN = "30,225,40";

// Once fully merged, the glow pulses a couple of times before settling
// into a steady glow — an arrival beat, not a persistent animation. A
// short delay before it starts (rather than pulsing the instant it
// merges) reads as a deliberate beat instead of blending into the zip
// itself, and stretching the pulse span out gives it enough screen time
// to actually register before it settles.
const PULSE_DELAY_S = 0.4;
const PULSE_DURATION_S = 5.0;
const PULSE_CYCLES = 2;
function pulseMul(elapsed: number) {
  if (elapsed < PULSE_DELAY_S) return 1;
  const active = elapsed - PULSE_DELAY_S;
  const span = PULSE_DURATION_S - PULSE_DELAY_S;
  if (active >= span) return 1;
  const envelope = 1 - active / span;
  const osc = Math.sin((active / span) * PULSE_CYCLES * Math.PI * 2);
  return 1 + osc * 0.35 * envelope;
}

const BANDS = [
  { freq: 0.05, amp: 0.2, phase: 0.6, speed: 1.7, yoff: -0.22 },
  { freq: 0.07, amp: 0.13, phase: 2.6, speed: -1.3, yoff: 0.03 },
  { freq: 0.04, amp: 0.16, phase: 4.8, speed: 1.0, yoff: 0.24 },
];
const N = 160;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function targetY(x: number, h: number, t: number) {
  return Math.sin(x * 0.02 - t * 1.1) * (h * 0.24);
}

const WHITE_RGB: [number, number, number] = [255, 255, 255];
const MARK_GREEN_RGB: [number, number, number] = [30, 225, 40];

function lerpRgb(a: [number, number, number], b: [number, number, number], t: number) {
  return `${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))}`;
}

export function useZipperMerge(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  progressRef: React.RefObject<number>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let W = 0;
    let H = 0;
    // Timestamp the glow first reached full strength, so the pulse
    // plays once from that moment rather than replaying every frame —
    // reset whenever the line un-merges (scrolled back up).
    let mergedAt: number | null = null;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function draw(t: number, progress: number) {
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighten";
      const midY = H * 0.5;
      const transitionW = W * 0.1;
      // Zips closed from the right: mergeX sweeps from just past the
      // right edge (nothing merged, matches the Problem state) to just
      // past the left edge (fully merged, matches the Solution state)
      // as progress goes 0 -> 1.
      const mergeX = W - (W + transitionW) * progress;
      // The bands only finish converging to a single line at the far
      // (right) edge of the ramp zone — that's the actual conversion
      // point the marker should ride, not mergeX itself, which is where
      // convergence starts.
      const convergeX = Math.min(W, Math.max(0, mergeX + transitionW));

      // Once the whole line is merged, it settles into a green glow
      // instead of staying white — ramps in over the last stretch of
      // scroll progress and holds as long as progress stays at 1.
      const mergedGlow = Math.min(1, Math.max(0, (progress - 0.92) / 0.08));

      if (mergedGlow >= 1) {
        if (mergedAt === null) mergedAt = t;
      } else {
        mergedAt = null;
      }
      const pulse = mergedAt !== null ? pulseMul(t - mergedAt) : 1;

      if (mergedGlow > 0.01) {
        // Several widening, fading passes over the same path approximate
        // a soft radial falloff without relying on ctx.shadowBlur — it
        // doesn't reliably render under a non-default
        // globalCompositeOperation (the whole canvas is "lighten" here),
        // so it was silently producing no visible glow at all. Only the
        // glow's size/strength pulses — the crisp line underneath
        // (drawn below) stays a steady color throughout.
        const strength = mergedGlow * pulse;
        const glowLayers = [
          { width: 16, alpha: 0.07 },
          { width: 10, alpha: 0.13 },
          { width: 6, alpha: 0.2 },
          { width: 3, alpha: 0.3 },
        ];
        glowLayers.forEach((layer) => {
          ctx!.beginPath();
          for (let i = 0; i <= N; i++) {
            const x = (i / N) * W;
            const y = midY + targetY(x, H, t);
            if (i === 0) ctx!.moveTo(x, y);
            else ctx!.lineTo(x, y);
          }
          ctx!.strokeStyle = `rgba(${MARK_GREEN},${Math.min(1, layer.alpha * strength).toFixed(3)})`;
          ctx!.lineWidth = layer.width;
          ctx!.lineCap = "round";
          ctx!.stroke();
        });
      }

      BANDS.forEach((b, bi) => {
        ctx!.beginPath();
        for (let i = 0; i <= N; i++) {
          const x = (i / N) * W;
          const bandY =
            b.yoff * H + Math.sin(x * b.freq + t * b.speed + b.phase) * b.amp * H;
          const ty = targetY(x, H, t);
          // Merged (localT=1) to the right of mergeX, ramping down to
          // the band's own noisy position over transitionW to the left.
          const localT = Math.min(1, Math.max(0, (x - mergeX) / transitionW));
          const y = midY + lerp(bandY, ty, localT);
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        const alpha = bi === 0 ? 0.85 : 0.5;
        ctx!.strokeStyle = `rgba(${lerpRgb(WHITE_RGB, MARK_GREEN_RGB, mergedGlow)},${alpha})`;
        ctx!.lineWidth = bi === 0 ? 1.6 : 1.1;
        ctx!.stroke();
      });

      if (progress > 0.02 && progress < 0.9) {
        const zy = midY + targetY(convergeX, H, t);
        ctx!.beginPath();
        ctx!.arc(convergeX, zy, 2.4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${MARK_GREEN},0.9)`;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(convergeX, zy, 7, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${MARK_GREEN},0.4)`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    if (reducedMotion) {
      draw(0, progressRef.current ?? 0);
      const ro = new ResizeObserver(() => {
        resize();
        draw(0, progressRef.current ?? 0);
      });
      ro.observe(container);
      return () => ro.disconnect();
    }

    let frameId = 0;
    function frame(now: number) {
      draw(now / 1000, progressRef.current ?? 0);
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [canvasRef, containerRef, progressRef]);
}
