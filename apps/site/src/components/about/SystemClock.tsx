"use client";

import { useEffect, useState } from "react";

// A small live UTC readout for the About hero's otherwise-empty right
// side — echoes the command-center HUD feel of the homepage's globe
// overlay (coordinates/signal tags baked into that video) without
// inventing a fake stat; the clock is simply, verifiably correct.
export function SystemClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const hh = String(time.getUTCHours()).padStart(2, "0");
  const mm = String(time.getUTCMinutes()).padStart(2, "0");
  const ss = String(time.getUTCSeconds()).padStart(2, "0");

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-sans text-[12px] leading-[16.8px] tracking-[-0.12px] text-neutral-500">
        Coordinated Universal Time
      </span>
      <span className="font-mono text-[24px] leading-[1] text-white">
        {hh}:{mm}:{ss}
      </span>
    </div>
  );
}
