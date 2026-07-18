import { type ReactNode } from "react";

/**
 * Hosts a live design-system component on its native dark surface,
 * inside the light docs chrome — mirrors how standards.apple.com shows
 * dark-mode previews inside an otherwise light reference page.
 */
export function PreviewCard({
  children,
  align = "center",
}: {
  children: ReactNode;
  align?: "center" | "start" | "stretch";
}) {
  const alignClass =
    align === "center"
      ? "items-center justify-center"
      : align === "start"
        ? "items-start justify-start"
        : "items-stretch justify-stretch";

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-900/10">
      <div
        className={`flex min-h-[220px] w-full bg-neutral-900 p-10 ${alignClass}`}
      >
        {children}
      </div>
    </div>
  );
}
