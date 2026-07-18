import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { Icon } from "./icons/Icon";
import { ButtonLinkout } from "./ButtonLinkout";

/**
 * Figma "Navigation mobile" component (Nav=closed / Nav=open).
 * Both variants share identical internal content in the source file —
 * the only difference is the outer frame's height (78px vs 556px) with
 * clipped overflow, i.e. a slide-down disclosure panel. That's
 * reproduced here with a real toggle + animated max-height.
 */
export interface NavigationMobileProps {
  logo?: ReactNode;
  links?: string[];
  linkoutLabel?: string;
  onLinkClick?: (link: string) => void;
  onLinkoutClick?: () => void;
  className?: string;
}

const DEFAULT_LINKS = ["Benefits", "Specifications", "How-to", "Contact Us"];

export function NavigationMobile({
  logo = "Area",
  links = DEFAULT_LINKS,
  linkoutLabel = "Learn More",
  onLinkClick,
  onLinkoutClick,
  className,
}: NavigationMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={clsx("w-full overflow-hidden bg-neutral-900", className)}>
      <div className="flex items-center justify-between px-5 pb-[50px] pt-5">
        <div className="font-logotype text-[30px] font-medium leading-[36px] tracking-[-2.4px] text-neutral-100">
          {logo}
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-6 items-center justify-center text-neutral-100"
        >
          <Icon name={open ? "close" : "menu"} className="h-3 w-[18px]" />
        </button>
      </div>
      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-[50px] px-5 pb-8 pt-2">
            <div className="flex flex-col">
              {links.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => onLinkClick?.(link)}
                  className="border-b border-neutral-100 py-[30px] text-left font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
                >
                  {link}
                </button>
              ))}
            </div>
            <ButtonLinkout onClick={onLinkoutClick} className="self-start">
              {linkoutLabel}
            </ButtonLinkout>
          </div>
        </div>
      </div>
    </nav>
  );
}
