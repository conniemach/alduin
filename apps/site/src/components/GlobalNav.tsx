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
 * No blur (tried it, tried a progressive multi-layer version of it too
 * — both read as a distracting haze over bright content like the hero
 * globe). Instead this just fades whatever's behind it straight to
 * pure black — the same black as the page's own background — so
 * content doesn't get blurred, it disappears into the page itself, and
 * nothing here reads as its own tinted panel.
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
          backgroundImage:
            "linear-gradient(to bottom, #000000 35%, rgba(0, 0, 0, 0) 97%)",
        }}
      />
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[70px] min-[1440px]:px-[150px]">
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
