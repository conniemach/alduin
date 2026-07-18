import { Logo, Button, ProductsMenu } from "@alduin/design-system";

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
 * fully transparent by the bottom, not a flat color) plus a background
 * blur, so the page content passing underneath it reads as frosted
 * glass rather than being hard-cropped by an opaque bar. Figma specifies
 * that blur as *progressive* (10px at the top fading to 0px at the
 * bottom); CSS has no native progressive backdrop-filter, so this uses a
 * flat 10px blur as the closest single-value approximation.
 * Page.tsx compensates for this being taken out of flow with a
 * matching `pt-[116px]` on the content below.
 */
export function GlobalNav() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 h-[116px] backdrop-blur-[10px]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #1e1e1e 35%, rgba(30, 30, 30, 0) 97%)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-[70px]">
        <Logo className="h-10 w-auto" />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-5">
            <ProductsMenu />
            <a
              href="#contact"
              className="font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
            >
              Contact Us
            </a>
          </div>
          <Button>Request a Demo</Button>
        </div>
      </div>
    </header>
  );
}
