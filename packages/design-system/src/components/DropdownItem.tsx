import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * Figma "Dropdown" component (State=Unselected / Hover).
 * Note: in the source file, Hover is pixel-identical to Unselected (same
 * white text, no background) — likely an unfinished detail rather than
 * an intentional "no feedback" choice. A subtle background highlight is
 * added here so the row still reads as interactive on hover.
 */
export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={clsx(
        "w-full rounded-md px-2 py-2 text-left",
        "font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white",
        "transition-colors duration-300 ease-out",
        "hover:bg-white/5",
        className,
      )}
      {...props}
    />
  ),
);
DropdownItem.displayName = "DropdownItem";
