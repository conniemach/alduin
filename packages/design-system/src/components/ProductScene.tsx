import { useEffect, useRef } from "react";
import clsx from "clsx";
import { productSceneModes, type ProductSceneMode } from "../lib/product-scene-draw";

/**
 * Animated replacement for a static product screenshot in ProductFeatures —
 * a literal, Linear-style rendering of what each product does (an ops map,
 * a travel-risk map, a case-progression view, a briefing pipeline) instead
 * of a PNG. The canvas (see lib/product-scene-draw.ts) does the live
 * drawing; this component adds the glass/glow chrome on top (glow blobs,
 * a floating status card, a pulsing badge chip, and — Cypher only — a
 * stage stepper), matching the "Product Visual Concepts v7" exploration.
 * Copy, codes, and coordinates shown are still placeholders, not real
 * product data.
 */
export interface ProductSceneProps {
  mode: ProductSceneMode;
  className?: string;
}

export function ProductScene({ mode, className }: ProductSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scene = productSceneModes[mode];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let logicalW = 0;
    let logicalH = 0;
    let state: unknown = null;

    function resize() {
      const rect = frame!.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height;
      canvas!.width = Math.max(1, Math.round(logicalW * dpr));
      canvas!.height = Math.max(1, Math.round(logicalH * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = scene.init(logicalW, logicalH);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(frame);
    resize();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;

    if (reduced) {
      scene.draw(ctx, logicalW, logicalH, 0, state);
    } else {
      const tick = (now: number) => {
        if (logicalW && logicalH) scene.draw(ctx, logicalW, logicalH, now / 1000, state);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mode]);

  return (
    <div ref={frameRef} className={clsx("product-scene", className)}>
      <canvas ref={canvasRef} className="product-scene-canvas" />
      <ProductSceneOverlay mode={mode} />
    </div>
  );
}

function ProductSceneOverlay({ mode }: { mode: ProductSceneMode }) {
  switch (mode) {
    case "cobalt":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-20%", left: "0%", width: "55%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-glow" style={{ top: "10%", right: "-15%", width: "45%", height: "110%", background: "var(--product-scene-glow-b)" }} />
          <div className="product-scene-card" style={{ left: 18, bottom: 16, width: 172 }}>
            <div className="product-scene-card-title">MISSION STATUS</div>
            <div className="product-scene-row">
              <span className="product-scene-dot product-scene-dot-good" />
              <span className="product-scene-row-name">Sector 2</span>
              <span className="product-scene-row-sub">MONITOR</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-dot product-scene-dot-warn" />
              <span className="product-scene-row-name">Sector 4</span>
              <span className="product-scene-row-sub">ELEVATED</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-dot product-scene-dot-crit" />
              <span className="product-scene-row-name">Coastal AOR</span>
              <span className="product-scene-row-sub">SEVERE</span>
            </div>
          </div>
          <div className="product-scene-badge" style={{ top: 16, right: 20 }}>
            <span className="product-scene-dot product-scene-dot-crit" />
            SEISMIC M4.2 · 12km
          </div>
        </>
      );
    case "cobalt-corridor":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-20%", left: "-5%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-badge" style={{ right: 20, bottom: 18 }}>
            <span className="product-scene-dot product-scene-dot-warn" />
            IMPACT CORRIDOR · ASSET FLAGGED
          </div>
        </>
      );
    case "boreas":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-15%", right: "0%", width: "55%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-glow" style={{ bottom: "-10%", left: "-10%", width: "40%", height: "100%", background: "var(--product-scene-glow-b)" }} />
          <div className="product-scene-card" style={{ right: 18, top: 18, width: 182 }}>
            <div className="product-scene-card-title">TRAVELER EXPOSURE</div>
            <div className="product-scene-row">
              <span className="product-scene-avatar">MK</span>
              <span className="product-scene-row-name">M. Kaur · Bogotá</span>
              <span className="product-scene-row-sub" style={{ color: "var(--product-scene-crit)" }}>HIGH</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-avatar">DR</span>
              <span className="product-scene-row-name">D. Reyes · São Paulo</span>
              <span className="product-scene-row-sub" style={{ color: "var(--product-scene-warn)" }}>MED</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-avatar">AS</span>
              <span className="product-scene-row-name">A. Singh · London</span>
              <span className="product-scene-row-sub" style={{ color: "var(--product-scene-good)" }}>LOW</span>
            </div>
          </div>
          <div className="product-scene-badge" style={{ left: 20, bottom: 18 }}>
            <span className="product-scene-dot product-scene-dot-crit" />
            EXPOSURE ALERT · BGT
          </div>
        </>
      );
    case "cypher":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-25%", left: "20%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-stepper">
            <div className="product-scene-step product-scene-step-done">
              <span className="product-scene-step-node" />
              <span className="product-scene-step-label">INTAKE</span>
            </div>
            <div className="product-scene-step-line product-scene-step-line-done" />
            <div className="product-scene-step product-scene-step-active">
              <span className="product-scene-step-node" />
              <span className="product-scene-step-label">INVESTIGATION</span>
            </div>
            <div className="product-scene-step-line" />
            <div className="product-scene-step">
              <span className="product-scene-step-node" />
              <span className="product-scene-step-label">REVIEW</span>
            </div>
            <div className="product-scene-step-line" />
            <div className="product-scene-step">
              <span className="product-scene-step-node" />
              <span className="product-scene-step-label">CLOSED</span>
            </div>
          </div>
          <div className="product-scene-card" style={{ left: 18, bottom: 16, width: 190 }}>
            <div className="product-scene-card-title">SUBJECT PROFILE</div>
            <div className="product-scene-row">
              <span className="product-scene-avatar">04</span>
              <span className="product-scene-row-name">Subject 04 · &ldquo;Raven&rdquo;</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-row-sub">3 aliases · last seen Newark, NJ</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-dot product-scene-dot-good" />
              <span className="product-scene-row-name">Chain of custody</span>
              <span className="product-scene-row-sub" style={{ color: "var(--product-scene-good)" }}>VERIFIED</span>
            </div>
          </div>
          <div className="product-scene-badge" style={{ right: 20, bottom: 16 }}>
            <span className="product-scene-dot product-scene-dot-warn" />
            EVIDENCE LINKED · #0417
          </div>
        </>
      );
    case "nightwatch":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-20%", left: "-10%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-glow" style={{ bottom: "-15%", right: "0%", width: "45%", height: "110%", background: "var(--product-scene-glow-b)" }} />
          <div className="product-scene-card" style={{ right: 18, top: 18, width: 176 }}>
            <div className="product-scene-card-title">PRIORITY SIGNALS</div>
            <div className="product-scene-row">
              <span className="product-scene-row-name">Border crossings +12%</span>
              <span className="product-scene-row-sub">01</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-row-name">Sector 7 checkpoint</span>
              <span className="product-scene-row-sub">02</span>
            </div>
            <div className="product-scene-row">
              <span className="product-scene-row-name">Convoy delay, Route 9</span>
              <span className="product-scene-row-sub">03</span>
            </div>
          </div>
          <div className="product-scene-badge" style={{ left: 20, bottom: 18 }}>
            <span className="product-scene-dot product-scene-dot-good" />
            BRIEF READY · 06:00
          </div>
        </>
      );
    case "nightwatch-topics":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-20%", left: "-10%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-glow" style={{ bottom: "-15%", right: "0%", width: "45%", height: "110%", background: "var(--product-scene-glow-b)" }} />
          <div className="product-scene-badge" style={{ right: 20, bottom: 18 }}>
            <span className="product-scene-dot product-scene-dot-good" />
            PERSONALIZED · 3 TOPICS
          </div>
        </>
      );
    case "nightwatch-report":
      return (
        <>
          <div className="product-scene-glow" style={{ top: "-20%", left: "-10%", width: "50%", height: "130%", background: "var(--product-scene-glow-a)" }} />
          <div className="product-scene-glow" style={{ bottom: "-15%", right: "0%", width: "45%", height: "110%", background: "var(--product-scene-glow-b)" }} />
          <div className="product-scene-badge" style={{ right: 20, top: 18 }}>
            <span className="product-scene-dot product-scene-dot-good" />
            EXPORT READY
          </div>
        </>
      );
  }
}
