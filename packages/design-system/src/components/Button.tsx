import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * Figma "Button" component (Type=Primary / Type=Hover), reimagined as
 * "liquid glass" — but matching how Apple's own dark-mode liquid glass
 * treats a *primary* action (e.g. a photo editor's checkmark button):
 * nearly solid/opaque, not a see-through pane, so it reads as the one
 * high-contrast action among the surrounding translucent secondary glass
 * (see ButtonLinkout). The glass character shows up as a soft top
 * highlight and gentle shadow rather than background bleeding through.
 * The hover state is a second glass layer (its own gradient + blur)
 * crossfaded in via opacity rather than animating the resting layer's own
 * background directly — gradients can't interpolate smoothly between two
 * different stops, but opacity can, so this is what keeps Figma's slow
 * ~1s "Gentle" hover (tokens/motion.ts) looking like a smooth dissolve
 * instead of a hard cut.
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full",
        "border border-white/70 bg-gradient-to-b from-neutral-100/95 to-neutral-100/85 backdrop-blur-xl",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_6px_18px_-8px_rgba(0,0,0,0.4)]",
        "px-[22px] py-2.5",
        "font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
        className,
      )}
      {...props}
    >
      {/* Soft top-left sheen, subtle since the fill is already near-opaque */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(120%_120%_at_20%_15%,rgba(255,255,255,0.7),transparent_50%)]"
      />
      {/* Hover: a second, darker glass layer dissolved in over the light one */}
      <span
        aria-hidden="true"
        data-slot="hover-layer"
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-full opacity-0",
          "bg-gradient-to-b from-neutral-900/85 to-neutral-900/65 backdrop-blur-md",
          "transition-opacity duration-[1022ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:opacity-100",
        )}
      />
      <span
        data-slot="label"
        className={clsx(
          "relative z-10 text-neutral-900 transition-colors duration-[1022ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:text-neutral-100",
        )}
      >
        {children}
      </span>
    </button>
  ),
);
Button.displayName = "Button";
