"use client";

import { useRouter } from "next/navigation";
import { LogoLockup, Button, ProductsMenu } from "@alduin/design-system";

const PRODUCT_ROUTES: Record<string, string> = {
  Cobalt: "/products/cobalt",
  Boreas: "/products/boreas",
  Cypher: "/products/cypher",
  Nightwatch: "/products/nightwatch",
};

// Cypher is hidden site-wide for now (left in PRODUCT_ROUTES/design-system
// so it's a quick un-hide, not a rebuild) — see the ProductsMenu call
// below, and the same hide on the pricing and about pages.

/**
 * The homepage's actual nav bar — Figma's "Global Nav" frame on the Home
 * page. This is a bespoke composition (logo image, ProductsMenu, a plain
 * text link, and a regular Button as the CTA), not the generic
 * "Navigation" style-guide component, since the real page deviates from
 * that template (regular Button instead of ButtonLinkout, an extra
 * "Contact Us" link, an image logo instead of the placeholder text).
 *
 * Figma has this frame in a "FIXED" group, separate from the page's
 * "SCROLLS" content — it's meant to stay pinned to the top while the
 * page scrolls underneath, not scroll away with the rest of the header.
 * Its fill is a 116px-tall gradient (#1e1e1e opaque from the top down to
 * fully transparent by the bottom, not a flat color).
 * The blur behind it used to be faked as "progressive" (several stacked
 * backdrop-blur layers, each a different radius, each masked to fade out
 * over a different portion of the height) to avoid a flat blur's hard
 * seam at the header's edge. In practice each layer's backdrop-filter
 * samples whatever the layer behind it already rendered — blur included
 * — so the layers didn't just overlap, they compounded: blurring an
 * already-blurred image spreads bright pixels further each pass. Over
 * bright backgrounds (the hero globe's glowing line art) that compounding
 * washed the top of the nav out into a hazy white fog. A single blur
 * layer can't do that to itself, so this uses just one, masked to taper
 * out near the header's own bottom edge instead of stopping abruptly.
 * Page.tsx compensates for this being taken out of flow with a
 * matching `pt-[116px]` on the content below.
 */
export function GlobalNav() {
  const router = useRouter();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[116px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #1e1e1e 35%, rgba(30, 30, 30, 0) 97%)",
        }}
      />
      <div className="relative flex h-full w-full items-center justify-between px-[70px] min-[1441px]:px-[150px]">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Alduin home"
        >
          <LogoLockup />
        </button>
        <div className="flex items-center gap-8">
          <ProductsMenu
            products={["Cobalt", "Boreas", "Nightwatch"]}
            onSelect={(product) => {
              const route = PRODUCT_ROUTES[product];
              if (route) router.push(route);
            }}
          />
          <button
            type="button"
            onClick={() => router.push("/pricing")}
            className="font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={() => router.push("/about")}
            className="font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
          >
            About
          </button>
          <Button onClick={() => router.push("/request-a-demo")}>
            Request a Demo
          </Button>
        </div>
      </div>
    </header>
  );
}
