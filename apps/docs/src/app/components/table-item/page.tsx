import { TableItem } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

const labels = [
  "Ultra-fast browsing",
  "Real-time sync",
  "Offline mode",
  "Team workspaces",
];

export default function TableItemPage() {
  return (
    <DocPage
      kicker="Component"
      title="Table Item"
      description="One row of a checklist or comparison table: a checkmark and a label. Meant to be tiled in a grid — each item only draws its own top and left border, so a grid of them forms a clean shared grid line."
      preview={
        <PreviewCard align="stretch">
          <div className="grid grid-cols-1 border-r border-b border-neutral-100/[0.32] sm:grid-cols-2">
            {labels.map((label) => (
              <TableItem key={label} label={label} />
            ))}
          </div>
        </PreviewCard>
      }
    >
      <DeveloperSection>
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          Wrap a grid of these in a container with{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            border-t border-r
          </code>{" "}
          so the far top and right edges close off the grid.
        </p>
        <CodeBlock
          code={`import { TableItem } from "@alduin/design-system";

<div className="grid grid-cols-2 border-t border-r border-neutral-100/[0.32]">
  <TableItem label="Ultra-fast browsing" />
  <TableItem label="Real-time sync" />
</div>`}
        />
        <PropsTable
          rows={[
            {
              name: "label",
              type: "string",
              description: "The row's text.",
            },
          ]}
        />
      </DeveloperSection>
    </DocPage>
  );
}
