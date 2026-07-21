"use client";

import { useRouter } from "next/navigation";
import { LogoLockup, Button, ProductsMenu } from "@alduin/design-system";

const PRODUCT_ROUTES: Record<string, string> = {
  Cobalt: "/products/cobalt",
  Boreas: "/products/boreas",
  Cypher: "/products/cypher",
  Nightwatch: "/products/nightwatch",
};

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
 * fully transparent by the bottom, not a flat color), and Figma specifies
 * the blur behind it as *progressive* too (strong at the top, fading to
 * 0px at the bottom) rather than a single flat blur radius — a flat
 * `backdrop-blur` produces a hard-edged blur/sharp seam right where the
 * element ends, since the blur itself doesn't taper even though the tint
 * does. CSS has no native progressive backdrop-filter, so this fakes one
 * with several stacked layers, each blurred by a different amount and
 * each masked to fade out over a different portion of the height; where
 * layers overlap near the top their blur compounds (each one samples
 * whatever the layer behind it already rendered, blur included), and
 * fewer layers reach the bottom, so the effective blur strength ramps
 * down smoothly instead of cutting off — the same trick used for iOS's
 * "liquid glass" progressive blur.
 * Page.tsx compensates for this being taken out of flow with a
 * matching `pt-[116px]` on the content below.
 */
const PROGRESSIVE_BLUR_LAYERS = [
  { blur: 2, fadeEnd: 100 },
  { blur: 4, fadeEnd: 80 },
  { blur: 8, fadeEnd: 60 },
  { blur: 16, fadeEnd: 40 },
];

export function GlobalNav() {
  const router = useRouter();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[116px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #1e1e1e 35%, rgba(30, 30, 30, 0) 97%)",
        }}
      />
      {PROGRESSIVE_BLUR_LAYERS.map(({ blur, fadeEnd }) => (
        <div
          key={blur}
          className="pointer-events-none absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to bottom, black, transparent ${fadeEnd}%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black, transparent ${fadeEnd}%)`,
          }}
        />
      ))}
      <div className="relative flex h-full w-full items-center justify-between px-[70px] min-[1441px]:px-[150px]">
        <LogoLockup />
        <div className="flex items-center gap-8">
          <ProductsMenu
            onSelect={(product) => {
              const route = PRODUCT_ROUTES[product];
              if (route) router.push(route);
            }}
          />
          <a
            href="#contact"
            className="font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
          >
            Contact Us
          </a>
          <Button>Request a Demo</Button>
        </div>
      </div>
    </header>
  );
}
