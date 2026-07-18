import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { Icon } from "./icons/Icon";

/**
 * Figma "Button linkout" component (State=Primary / State=Hover).
 * Black pill with an arrow-up-right glyph; on hover the fill stays black
 * and a thin white outline appears (no color change, unlike Button).
 */
export type ButtonLinkoutProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonLinkout = forwardRef<HTMLButtonElement, ButtonLinkoutProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-0.5 rounded-full",
        "border-[0.5px] border-transparent bg-black px-[22px] py-2.5 text-white",
        "font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px]",
        "transition-[border-color] duration-[894ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:border-white",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
      <Icon name="arrow-up-right" className="size-[6px]" />
    </button>
  ),
);
ButtonLinkout.displayName = "ButtonLinkout";
