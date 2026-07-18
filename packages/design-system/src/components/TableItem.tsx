import { type HTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { Icon } from "./icons/Icon";

/**
 * Figma "Table item" component — a checklist row (comparison table /
 * spec list). Left + bottom border only, so a grid of these tiles.
 */
export interface TableItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

export const TableItem = forwardRef<HTMLDivElement, TableItemProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex items-center gap-2 border-b border-l border-neutral-100/[0.32] px-[30px] py-8",
        className,
      )}
      {...props}
    >
      <Icon name="check" className="size-3.5 shrink-0 text-neutral-200" />
      <span className="font-sans text-[12px] leading-[16.8px] tracking-[-0.12px] text-white">
        {label}
      </span>
    </div>
  ),
);
TableItem.displayName = "TableItem";
