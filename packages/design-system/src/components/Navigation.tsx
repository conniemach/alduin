import { type ReactNode } from "react";
import clsx from "clsx";
import { ButtonLinkout } from "./ButtonLinkout";

/**
 * Figma "Navigation" component (Breakpoint=Desktop / Tablet).
 * Figma models the two breakpoints as separate fixed-width variants;
 * here that's one component that's responsive via CSS instead, which is
 * the equivalent (and more useful) behavior on the actual site.
 * The source component only contains a logo slot ("Area" placeholder
 * text) and a single linkout CTA — no nav links are baked in, so none
 * are invented here; compose <ProductsMenu /> etc. alongside this when
 * assembling a real page header.
 */
export interface NavigationProps {
  logo?: ReactNode;
  linkoutLabel?: string;
  onLinkoutClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function Navigation({
  logo = "Area",
  linkoutLabel = "Learn More",
  onLinkoutClick,
  children,
  className,
}: NavigationProps) {
  return (
    <nav
      className={clsx(
        "flex w-full items-center justify-between px-10 py-7",
        className,
      )}
    >
      <div className="font-logotype text-[30px] font-medium leading-[36px] tracking-[-1.5px] text-neutral-200">
        {logo}
      </div>
      <div className="flex items-center gap-8">
        {children}
        <ButtonLinkout onClick={onLinkoutClick}>{linkoutLabel}</ButtonLinkout>
      </div>
    </nav>
  );
}
