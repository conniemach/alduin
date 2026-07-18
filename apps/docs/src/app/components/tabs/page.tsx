"use client";

import { useState } from "react";
import { Tab } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

const labels = ["COBALT", "BOREAS", "CYPHER", "NIGHTWATCH"];

export default function TabsPage() {
  const [active, setActive] = useState(labels[0]);

  return (
    <DocPage
      kicker="Component"
      title="Tab"
      description="Switches between views without navigating away — used to flip between products, or between slides in a carousel. Unselected tabs sit at half opacity so the selected one reads clearly, without needing an underline or background."
      preview={
        <PreviewCard>
          <div className="inline-flex items-center gap-3 rounded-full bg-neutral-850 px-4 py-2">
            {labels.map((label) => (
              <Tab
                key={label}
                active={active === label}
                onClick={() => setActive(label)}
              >
                {label}
              </Tab>
            ))}
          </div>
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          Try it
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          Click a tab above. The active one becomes fully opaque and steps
          up to medium weight; hover an inactive one to preview it before
          committing.
        </p>
      </div>

      <DeveloperSection>
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          Tab is controlled — it doesn&rsquo;t track its own selected state.
          The parent (like ProductFeatures) owns which tab is active.
        </p>
        <CodeBlock
          code={`import { Tab } from "@alduin/design-system";

const [active, setActive] = useState("COBALT");

<Tab active={active === "COBALT"} onClick={() => setActive("COBALT")}>
  COBALT
</Tab>`}
        />
        <PropsTable
          rows={[
            {
              name: "active",
              type: "boolean",
              default: "false",
              description: "Marks this tab as the current selection.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Tab label.",
            },
            {
              name: "...props",
              type: "ButtonHTMLAttributes",
              description: "onClick, disabled, etc.",
            },
          ]}
        />
      </DeveloperSection>
    </DocPage>
  );
}
