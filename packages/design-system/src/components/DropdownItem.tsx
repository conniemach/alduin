import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * Figma "Dropdown" component (State=Unselected / Hover).
 * Hover reveals a thin light outline around the row (no background fill,
 * text stays the same white) — confirmed against the Figma spec.
 */
export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={clsx(
        "w-full rounded-md border border-transparent px-2 py-2 text-left",
        "font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white",
        "transition-[border-color] duration-300 ease-out",
        "hover:border-white/40",
        className,
      )}
      {...props}
    />
  ),
);
DropdownItem.displayName = "DropdownItem";
