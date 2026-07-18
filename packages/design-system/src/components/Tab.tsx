import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * Figma "TAB" component (State=Inactive / Hover / Active).
 * Inactive tabs sit at 50% opacity; hovering (or being active) brings
 * them to full opacity. Active additionally steps up to medium weight.
 * This is a controlled component — pass `active` from the parent that
 * owns which tab is selected (see ProductFeatures).
 */
export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ className, active = false, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      className={clsx(
        "inline-flex items-center justify-center gap-0.5 rounded-full px-1 py-1",
        "font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white",
        "transition-opacity duration-[1022ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "font-medium opacity-100" : "font-normal opacity-50 hover:opacity-100",
        className,
      )}
      {...props}
    />
  ),
);
Tab.displayName = "Tab";
