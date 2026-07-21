import { Button, ButtonLinkout } from "@alduin/design-system";

export function Hero() {
  return (
    <section className="relative bg-black px-[70px] pb-20 pt-5 min-[1441px]:px-[150px]">
      <video
        src="/hero-globe.mov"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute right-[1%] top-[46%] w-[46%] max-w-none -translate-x-[45px] -translate-y-1/2 select-none"
      />
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
          <Button>Request a Demo</Button>
          <ButtonLinkout>View Products</ButtonLinkout>
        </div>
      </div>
    </section>
  );
}
