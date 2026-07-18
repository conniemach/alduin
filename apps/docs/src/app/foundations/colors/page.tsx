import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";

const swatches = [
  { name: "White", token: "white", hex: "#ffffff", className: "bg-white" },
  { name: "Neutral 100", token: "neutral-100", hex: "#e9e9e9", className: "bg-neutral-100" },
  { name: "Neutral 150", token: "neutral-150", hex: "#dcdcdc", className: "bg-neutral-150" },
  { name: "Neutral 200", token: "neutral-200", hex: "#d1d1d1", className: "bg-neutral-200" },
  { name: "Neutral 500", token: "neutral-500", hex: "#6f6f6f", className: "bg-neutral-500" },
  { name: "Neutral 700", token: "neutral-700", hex: "#393939", className: "bg-neutral-700" },
  { name: "Neutral 800", token: "neutral-800", hex: "#282828", className: "bg-neutral-800" },
  { name: "Neutral 850", token: "neutral-850", hex: "#272727", className: "bg-neutral-850" },
  { name: "Neutral 900", token: "neutral-900", hex: "#1e1e1e", className: "bg-neutral-900" },
  { name: "Black", token: "black", hex: "#000000", className: "bg-black" },
];

export default function ColorsPage() {
  return (
    <DocPage
      kicker="Foundation"
      title="Color"
      description="Alduin is intentionally monochrome — one grayscale ramp, no brand hue. Everything from page backgrounds to button states is built from these ten values, so contrast and hierarchy always come from lightness, not color."
      preview={
        <PreviewCard align="stretch">
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.token} className="flex flex-col gap-2">
                <div
                  className={`h-16 w-full rounded-md border border-white/10 ${s.className}`}
                />
                <div className="font-sans text-[12px] text-white">
                  {s.name}
                </div>
                <div className="font-mono text-[11px] text-neutral-500">
                  {s.hex}
                </div>
              </div>
            ))}
          </div>
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          When to use which
        </h2>
        <ul className="mt-3 flex flex-col gap-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          <li>
            <strong className="text-neutral-900">White / Neutral 100</strong>{" "}
            — primary text and content on dark surfaces.
          </li>
          <li>
            <strong className="text-neutral-900">Neutral 200 / 500</strong> —
            secondary and muted text, icons, borders.
          </li>
          <li>
            <strong className="text-neutral-900">Neutral 850 / 900</strong> —
            page and panel backgrounds. 900 is the default app background.
          </li>
          <li>
            <strong className="text-neutral-900">Black</strong> — the
            highest-contrast surface, reserved for the linkout button.
          </li>
        </ul>
      </div>

      <DeveloperSection>
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          Every color is a Tailwind utility already — use{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            bg-neutral-500
          </code>
          ,{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            text-neutral-500
          </code>
          , or{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            border-neutral-500
          </code>{" "}
          directly. White and black are Tailwind&rsquo;s built-in{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            white
          </code>{" "}
          /{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            black
          </code>
          , not custom tokens.
        </p>
        <PropsTable
          rows={swatches.map((s) => ({
            name: s.token,
            type: "color",
            default: s.hex,
            description: `Tailwind: bg-${s.token} / text-${s.token} / border-${s.token}`,
          }))}
        />
      </DeveloperSection>
    </DocPage>
  );
}
