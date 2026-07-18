import { type ReactNode } from "react";

export function DocPage({
  kicker,
  title,
  description,
  preview,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  preview: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[860px] px-12 py-16">
      <div className="font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-neutral-500">
        {kicker}
      </div>
      <h1 className="mt-2 font-display text-[44px] leading-[1.1] text-neutral-900">
        {title}
      </h1>
      <p className="mt-4 max-w-[560px] font-sans text-[16px] leading-[26px] text-neutral-700">
        {description}
      </p>

      <div className="mt-10">{preview}</div>

      {children && <div className="mt-6 flex flex-col gap-6">{children}</div>}
    </div>
  );
}
