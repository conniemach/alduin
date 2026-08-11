import { Logo } from "@alduin/design-system";
import "./logo-lab.css";

/**
 * Throwaway comparison page for exploring logomark animation directions.
 * Not linked from nav, not meant to ship — delete once a direction is picked.
 */
export default function LogoLabPage() {
  return (
    <div className="logoLab-page">
      <div className="logoLab-grid">
        <div className="logoLab-card">
          <span className="logoLab-label">1. Signal</span>
          <p className="logoLab-desc">Breathing glow + broadcast rings (current /about treatment).</p>
          <div className="logoLab-scene">
            <div className="logoLab-signal-glow" />
            <span className="logoLab-signal-ring" style={{ animationDelay: "0s" }} />
            <span className="logoLab-signal-ring" style={{ animationDelay: "1s" }} />
            <span className="logoLab-signal-ring" style={{ animationDelay: "2s" }} />
            <Logo className="logoLab-signal-mark" />
          </div>
        </div>

        <div className="logoLab-card">
          <span className="logoLab-label">2. Radar sweep</span>
          <p className="logoLab-desc">Rotating scan beam over a radar face — weather/command-center motif.</p>
          <div className="logoLab-scene">
            <div className="logoLab-radar-face" />
            <div className="logoLab-radar-ring logoLab-radar-ring-1" />
            <div className="logoLab-radar-ring logoLab-radar-ring-2" />
            <div className="logoLab-radar-sweep" />
            <Logo className="logoLab-radar-mark" />
          </div>
        </div>

        <div className="logoLab-card">
          <span className="logoLab-label">3. Float / tilt</span>
          <p className="logoLab-desc">Same slow rock as the product-mark chips, applied to the mark itself.</p>
          <div className="logoLab-scene">
            <div className="logoLab-float-shadow" />
            <div className="logoLab-float-perspective">
              <div className="logoLab-float-wrap">
                <div className="logoLab-float-sheen" />
                <Logo className="logoLab-float-mark" />
              </div>
            </div>
          </div>
        </div>

        <div className="logoLab-card">
          <span className="logoLab-label">4. Scan reveal</span>
          <p className="logoLab-desc">A reading beam sweeps the mark, brightening it in passing.</p>
          <div className="logoLab-scene">
            <div className="logoLab-scan-wrap">
              <Logo className="logoLab-scan-mark" />
              <div className="logoLab-scan-beam" />
            </div>
          </div>
        </div>
      </div>

      <div className="logoLab-heading">Round 2 — sleeker, more dimensional</div>

      <div className="logoLab-grid">
        <div className="logoLab-card">
          <span className="logoLab-label">5. Aurora</span>
          <p className="logoLab-desc">Soft gradient blobs drift behind frosted glass; the mark stays calm.</p>
          <div className="logoLab-scene logoLab-aurora-scene">
            <div className="logoLab-aurora-blob logoLab-aurora-blob-a" />
            <div className="logoLab-aurora-blob logoLab-aurora-blob-b" />
            <div className="logoLab-aurora-panel">
              <Logo className="logoLab-aurora-mark" />
            </div>
          </div>
        </div>

        <div className="logoLab-card">
          <span className="logoLab-label">6. Specular glass</span>
          <p className="logoLab-desc">A glossy tile with a light sheen arcing across it, like a Raycast icon.</p>
          <div className="logoLab-scene">
            <div className="logoLab-glass-tile">
              <div className="logoLab-glass-glow" />
              <Logo className="logoLab-glass-mark" />
              <div className="logoLab-glass-specular" />
              <div className="logoLab-glass-rim" />
            </div>
          </div>
        </div>

        <div className="logoLab-card">
          <span className="logoLab-label">7. Parallax orbit</span>
          <p className="logoLab-desc">A tilted ring with a traveling highlight orbits the mark in real 3D depth.</p>
          <div className="logoLab-scene">
            <div className="logoLab-orbit-perspective">
              <div className="logoLab-orbit-group">
                <div className="logoLab-orbit-ring" />
                <div className="logoLab-orbit-glow" />
                <Logo className="logoLab-orbit-mark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
