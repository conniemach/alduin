import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * Figma "Button" component (Type=Primary / Type=Hover).
 * White pill, dark text; hover swaps to a dark fill with light text.
 * Figma specifies an unusually slow ~1s "Gentle" hover transition for
 * this component specifically — see tokens/motion.ts.
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2.5 rounded-full",
        "bg-white px-[22px] py-2.5 text-neutral-900",
        "font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px]",
        "transition-colors duration-[1022ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-neutral-800 hover:text-neutral-100",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
