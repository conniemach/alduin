"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLinkout } from "@alduin/design-system";

// Lower fade = longer, smoother motion trail; higher fade = shorter trail.
const TRAIL_FADE = 0.22;

function useGlobeMotionTrail(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!video || !canvas || !ctx) return;

    let frameId: number;
    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighten";
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(frameId);
  }, [videoRef, canvasRef]);
}

export function Hero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useGlobeMotionTrail(videoRef, canvasRef);

  return (
    <section className="relative bg-black px-[70px] pb-20 pt-5 min-[1441px]:px-[150px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[1%] top-[46%] w-[46%] max-w-none -translate-x-[45px] -translate-y-1/2 select-none"
      >
        <div className="absolute inset-0 scale-110 rounded-full bg-white/[0.03] blur-3xl" />
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="absolute inset-0 h-full w-full mix-blend-screen opacity-85"
        />
        <video
          ref={videoRef}
          src="/alduin/hero-globe.mov"
          autoPlay
          loop
          muted
          playsInline
          className="relative h-full w-full brightness-[2.4]"
        />
      </div>
      <div className="relative flex flex-col gap-10 py-[110px]">
        <div className="flex max-w-[632px] flex-col gap-0">
          <h1 className="font-display text-[80px] leading-[104px] text-white">
            SIGNAL OVER NOISE
          </h1>
          <p className="mt-4 font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
            Secure software built for teams that need clarity, resilience,
            and command-grade visibility
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Button onClick={() => router.push("/request-a-demo")}>
            Request a Demo
          </Button>
          <ButtonLinkout onClick={() => router.push("/pricing")}>
            View Pricing
          </ButtonLinkout>
        </div>
      </div>
    </section>
  );
}
