import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { Icon } from "./icons/Icon";

/**
 * Figma "Arrow right" / "Arrow Left" components (Type=Default / Hover).
 * 40x40 rounded-square icon button, used for carousel/pagination nav.
 * Uses a faster 300ms ease than Button/Tab (Figma specifies EASE_IN_AND_OUT
 * here, not the slow "Gentle" spring).
 */
export interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
}

export const ArrowButton = forwardRef<HTMLButtonElement, ArrowButtonProps>(
  ({ className, direction, "aria-label": ariaLabel, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel ?? (direction === "left" ? "Previous" : "Next")}
      className={clsx(
        "inline-flex size-10 items-center justify-center rounded-md bg-neutral-500 text-white",
        "transition-colors duration-300 ease-in-out",
        "hover:bg-neutral-850",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
        className,
      )}
      {...props}
    >
      <Icon name={direction === "left" ? "arrow-left" : "arrow-right"} className="h-[10px] w-[5px]" />
    </button>
  ),
);
ArrowButton.displayName = "ArrowButton";
