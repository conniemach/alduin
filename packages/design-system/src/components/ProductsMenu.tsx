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
      <div
        className={clsx(
          "absolute left-0 top-full z-10 mt-3 flex w-40 flex-col gap-3 rounded-md bg-neutral-900 p-2",
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
