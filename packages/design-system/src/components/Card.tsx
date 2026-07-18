import { type HTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "rounded-lg border border-neutral-200 bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx("text-lg font-semibold text-neutral-900", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx("mt-1 text-sm text-neutral-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";
