import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Colors",
};
export default meta;
type Story = StoryObj;

const swatches: { name: string; className: string; hex: string }[] = [
  { name: "white", className: "bg-white", hex: "#ffffff" },
  { name: "neutral-100", className: "bg-neutral-100", hex: "#e9e9e9" },
  { name: "neutral-150", className: "bg-neutral-150", hex: "#dcdcdc" },
  { name: "neutral-200", className: "bg-neutral-200", hex: "#d1d1d1" },
  { name: "neutral-500", className: "bg-neutral-500", hex: "#6f6f6f" },
  { name: "neutral-700", className: "bg-neutral-700", hex: "#393939" },
  { name: "neutral-800", className: "bg-neutral-800", hex: "#282828" },
  { name: "neutral-850", className: "bg-neutral-850", hex: "#272727" },
  { name: "neutral-900", className: "bg-neutral-900", hex: "#000000" },
  { name: "black", className: "bg-black", hex: "#000000" },
];

export const Palette: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {swatches.map((s) => (
        <div key={s.name} className="flex flex-col gap-2">
          <div
            className={`h-20 w-full rounded-md border border-white/10 ${s.className}`}
          />
          <div className="font-sans text-[12px] text-white">{s.name}</div>
          <div className="font-mono text-[12px] text-neutral-500">
            {s.hex}
          </div>
        </div>
      ))}
    </div>
  ),
};
