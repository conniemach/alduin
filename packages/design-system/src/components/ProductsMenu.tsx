import { useState } from "react";
import clsx from "clsx";
import { DropdownItem } from "./DropdownItem";

/**
 * Figma "Products Menu" component (Variant=CTA / Dropdown).
 * Figma's own prototype triggers this on hover (ON_HOVER -> Dropdown,
 * 300ms ease-out), so it opens on hover here too; click/keyboard also
 * toggle it for touch and accessibility.
 */
export interface ProductsMenuProps {
  products?: string[];
  onSelect?: (product: string) => void;
  className?: string;
}

const DEFAULT_PRODUCTS = ["Cobalt", "Boreas", "Cypher", "Nightwatch"];

export function ProductsMenu({
  products = DEFAULT_PRODUCTS,
  onSelect,
  className,
}: ProductsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={clsx("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
      >
        Products
      </button>
      {/* Bridges the visual mt-3 gap below: without it, that gap isn't
          covered by any element in this hoverable subtree, so the mouse
          passing through it briefly counts as leaving the whole menu and
          closes it before it ever reaches the dropdown. */}
      <div aria-hidden="true" className="absolute left-0 top-full h-3 w-40" />
      <div
        className={clsx(
          "absolute left-0 top-full z-10 mt-3 flex w-40 flex-col gap-3 rounded-md p-2",
          // Liquid glass: translucent dark fill + blur so it reads clearly
          // over whatever page content sits behind it, matching
          // ButtonLinkout's darker glass treatment elsewhere in the system.
          "border border-white/15 bg-neutral-900/70 backdrop-blur-xl",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_12px_28px_-12px_rgba(0,0,0,0.7)]",
          "origin-top transition-[opacity,transform] duration-300 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {products.map((product) => (
          <DropdownItem key={product} onClick={() => onSelect?.(product)}>
            {product}
          </DropdownItem>
        ))}
      </div>
    </div>
  );
}
