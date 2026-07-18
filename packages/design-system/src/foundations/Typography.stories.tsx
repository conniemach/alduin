import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Typography",
};
export default meta;
type Story = StoryObj;

const styles: {
  name: string;
  spec: string;
  className: string;
  sample: string;
}[] = [
  {
    name: "Display",
    spec: "Manrope 400 · 80/104 · substitutes Figma's Damascus",
    className: "font-display text-[80px] leading-[104px]",
    sample: "Header",
  },
  {
    name: "Heading LG",
    spec: "IBM Plex Mono 400 · 32/38.4",
    className: "font-mono text-[32px] leading-[38.4px]",
    sample: "Deployable independently.",
  },
  {
    name: "Heading Condensed",
    spec: "IBM Plex Sans Condensed 400 · 28/33.6",
    className: "font-condensed text-[28px] leading-[33.6px]",
    sample: "This product feature is the most important",
  },
  {
    name: "Heading SM",
    spec: "IBM Plex Mono 400 · 18/21.6 · -0.54",
    className: "font-mono text-[18px] leading-[21.6px] tracking-[-0.54px]",
    sample: "Key point here",
  },
  {
    name: "Heading SM (active)",
    spec: "IBM Plex Mono 500 · 18/21.6 · -0.54",
    className:
      "font-mono text-[18px] font-medium leading-[21.6px] tracking-[-0.54px]",
    sample: "COBALT",
  },
  {
    name: "Body",
    spec: "42dot Sans 400 · 15/21 · -0.075",
    className: "font-sans text-[15px] leading-[21px] tracking-[-0.075px]",
    sample:
      "Unlock data-driven decisions with comprehensive analytics, revealing key opportunities.",
  },
  {
    name: "Label",
    spec: "42dot Sans 400 · 12/16.8 · -0.12",
    className: "font-sans text-[12px] leading-[16.8px] tracking-[-0.12px]",
    sample: "Labels",
  },
  {
    name: "UI Bold",
    spec: "42dot Sans 700 · 14/19.6 · -0.35",
    className:
      "font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px]",
    sample: "UI Text",
  },
  {
    name: "Logotype",
    spec: "DM Sans 500 · 30/36 · -1.5 desktop / -2.4 mobile",
    className: "font-logotype text-[30px] font-medium leading-[36px] tracking-[-1.5px]",
    sample: "Area",
  },
];

export const TypeScale: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {styles.map((s) => (
        <div key={s.name} className="border-b border-white/10 pb-6">
          <div className="mb-2 font-sans text-[12px] text-neutral-500">
            {s.name} — {s.spec}
          </div>
          <div className={`text-white ${s.className}`}>{s.sample}</div>
        </div>
      ))}
    </div>
  ),
};
