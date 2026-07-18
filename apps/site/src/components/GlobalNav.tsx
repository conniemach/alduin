import { Logo, Button, ProductsMenu } from "@alduin/design-system";

/**
 * The homepage's actual nav bar — Figma's "Global Nav" frame on the Home
 * page. This is a bespoke composition (logo image, ProductsMenu, a plain
 * text link, and a regular Button as the CTA), not the generic
 * "Navigation" style-guide component, since the real page deviates from
 * that template (regular Button instead of ButtonLinkout, an extra
 * "Contact Us" link, an image logo instead of the placeholder text).
 */
export function GlobalNav() {
  return (
    <header className="flex w-full items-center justify-between px-[70px] py-9">
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
    </header>
  );
}
