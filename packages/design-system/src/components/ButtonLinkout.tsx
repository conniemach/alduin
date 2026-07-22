import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * Figma "Button linkout" component (State=Primary / State=Hover),
 * reimagined as darker "liquid glass" to pair with Button's lighter glass:
 * a translucent, backdrop-blurred pill with a thin rim-light border that
 * brightens on hover (border-color and box-shadow both animate natively,
 * so this one doesn't need Button's layered-crossfade trick).
 */
export type ButtonLinkoutProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonLinkout = forwardRef<HTMLButtonElement, ButtonLinkoutProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "relative inline-flex items-center justify-center gap-0.5 overflow-hidden rounded-full",
        "border-[0.5px] border-white/25 bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-md",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_-10px_rgba(0,0,0,0.6)]",
        "px-[22px] py-2.5 text-white",
        "font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px]",
        "transition-[border-color,box-shadow] duration-[894ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:border-white/70 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_24px_-10px_rgba(0,0,0,0.7)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(120%_120%_at_20%_15%,rgba(255,255,255,0.25),transparent_50%)]"
      />
      <span className="relative z-10 flex items-center gap-0.5">
        {children}
      </span>
    </button>
  ),
);
ButtonLinkout.displayName = "ButtonLinkout";
