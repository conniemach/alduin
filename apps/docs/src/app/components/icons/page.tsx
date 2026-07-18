import { Icon, type IconName } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { CodeBlock } from "@/components/CodeBlock";

const names: IconName[] = [
  "cable",
  "check",
  "close",
  "chart",
  "account",
  "earth",
  "government",
  "paint",
  "arrow-up-right",
  "arrow-left",
  "arrow-right",
  "menu",
];

export default function IconsPage() {
  return (
    <DocPage
      kicker="Component"
      title="Icons"
      description="The full icon set, exported directly from Figma's vector paths. Every icon takes its color from the surrounding text — set text-neutral-500 or any other color class and the icon follows."
      preview={
        <PreviewCard align="stretch">
          <div className="grid w-full grid-cols-3 gap-6 sm:grid-cols-6">
            {names.map((name) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <Icon name={name} className="size-6 text-white" />
                <span className="font-sans text-[12px] text-neutral-500">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </PreviewCard>
      }
    >
      <DeveloperSection>
        <CodeBlock
          code={`import { Icon } from "@alduin/design-system";

<Icon name="check" className="size-4 text-neutral-200" />`}
        />
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            name
          </code>{" "}
          accepts:{" "}
          {names.map((n) => (
            <code
              key={n}
              className="mr-1 rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[12px]"
            >
              {n}
            </code>
          ))}
        </p>
      </DeveloperSection>
    </DocPage>
  );
}
