import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";

const styles = [
  {
    name: "Display",
    usage: "Hero headlines only",
    spec: "Manrope · 80/104",
    className: "font-display text-[64px] leading-[1.1]",
    sample: "Header",
  },
  {
    name: "Heading LG",
    usage: "Section headlines",
    spec: "IBM Plex Mono 400 · 32/38.4",
    className: "font-mono text-[32px] leading-[38.4px]",
    sample: "Deployable independently.",
  },
  {
    name: "Heading Condensed",
    usage: "Alternate section headline",
    spec: "IBM Plex Sans Condensed 400 · 28/33.6",
    className: "font-condensed text-[28px] leading-[33.6px]",
    sample: "This product feature is the most important",
  },
  {
    name: "Heading SM",
    usage: "Tab labels, sub-headlines",
    spec: "IBM Plex Mono 400 · 18/21.6",
    className: "font-mono text-[18px] leading-[21.6px] tracking-[-0.54px]",
    sample: "Key point here",
  },
  {
    name: "Body",
    usage: "Paragraph copy",
    spec: "42dot Sans 400 · 15/21",
    className: "font-sans text-[15px] leading-[21px] tracking-[-0.075px]",
    sample:
      "Unlock data-driven decisions with comprehensive analytics, revealing key opportunities.",
  },
  {
    name: "Label",
    usage: "Eyebrows, small caps-style tags",
    spec: "42dot Sans 400 · 12/16.8",
    className: "font-sans text-[12px] leading-[16.8px] tracking-[-0.12px]",
    sample: "Labels",
  },
  {
    name: "UI Bold",
    usage: "Buttons, links, nav items",
    spec: "42dot Sans 700 · 14/19.6",
    className: "font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px]",
    sample: "UI Text",
  },
  {
    name: "Logotype",
    usage: "Wordmark placeholder",
    spec: "DM Sans 500 · 30/36",
    className: "font-logotype text-[30px] font-medium leading-[36px] tracking-[-1.5px]",
    sample: "Area",
  },
];

export default function TypographyPage() {
  return (
    <DocPage
      kicker="Foundation"
      title="Typography"
      description="Five typefaces, each doing one job: Manrope for the one big hero moment, IBM Plex Mono for headlines and technical-feeling labels, 42dot Sans for everything a person reads or clicks, IBM Plex Sans Condensed as an alternate headline, and DM Sans for the wordmark."
      preview={
        <PreviewCard align="stretch">
          <div className="flex w-full flex-col gap-8">
            {styles.map((s) => (
              <div key={s.name} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                <div className="mb-2 font-sans text-[12px] text-neutral-500">
                  {s.name} — {s.usage}
                </div>
                <div className={`text-white ${s.className}`}>{s.sample}</div>
              </div>
            ))}
          </div>
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          A note on the Display style
        </h2>
        <p className="mt-3 font-sans text-[15px] leading-[24px] text-neutral-700">
          The Figma file specifies &ldquo;Damascus&rdquo; for the hero
          headline — a font built into macOS that isn&rsquo;t available on
          the web. Manrope stands in for it here: a similar clean,
          geometric feel that actually renders for site visitors.
        </p>
      </div>

      <DeveloperSection>
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          Font families are available as Tailwind utilities:{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            font-display
          </code>
          ,{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            font-mono
          </code>
          ,{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            font-condensed
          </code>
          ,{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            font-sans
          </code>
          ,{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            font-logotype
          </code>
          . Sizes, weights, and letter-spacing aren&rsquo;t tokenized as
          separate utilities yet — apply the exact values shown per style
          with Tailwind&rsquo;s arbitrary-value syntax, as in the components.
        </p>
        <PropsTable
          rows={styles.map((s) => ({
            name: s.name,
            type: s.spec,
            description: s.usage,
          }))}
        />
      </DeveloperSection>
    </DocPage>
  );
}
