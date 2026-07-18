import { type ReactNode } from "react";

/**
 * Collapsed by default (native <details>, no JS needed) so the page
 * reads cleanly for a non-technical visitor, while still putting the
 * technical reference one click away for anyone who needs it.
 */
export function DeveloperSection({ children }: { children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-neutral-900/10 open:bg-neutral-100/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <span className="font-sans text-[14px] font-bold text-neutral-900">
          Developer details
        </span>
        <span className="font-sans text-[13px] text-neutral-500 transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="flex flex-col gap-5 px-5 pb-6">{children}</div>
    </details>
  );
}
