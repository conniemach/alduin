import { Logo } from "@alduin/design-system";

const RING_DELAYS = [0, 1, 2];

// Replaces the old SystemClock in this corner — same idea (an ambient
// detail for the hero's otherwise-empty right side), but ties into the
// brand's own "signal" motif (the product-mark glow, the hero globe's
// outward pulses) instead of a clock face: three staggered rings
// broadcast from the mark like a steady signal, over a slow breathing
// glow behind it. Sized to match the 280px base scene every ProductMark
// uses (see product-mark.css) rather than a small corner accent, so it
// reads with the same weight as a product tile.
export function AnimatedLogoMark() {
  return (
    <div className="relative flex size-[280px] items-center justify-center">
      <div className="absolute inset-0 animate-pulse rounded-full bg-[#1ee128]/15 blur-3xl" />
      {RING_DELAYS.map((delay) => (
        <span
          key={delay}
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-[#1ee128]/50"
          style={{
            animation: "about-logo-ping 3s cubic-bezier(0,0,0.2,1) infinite",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
      <Logo className="relative h-[130px] w-auto drop-shadow-[0_0_28px_rgba(30,225,40,0.55)]" />
    </div>
  );
}
