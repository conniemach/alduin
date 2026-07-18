import { Logo } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { CodeBlock } from "@/components/CodeBlock";

export default function LogoPage() {
  return (
    <DocPage
      kicker="Component"
      title="Logo"
      description="A placeholder wordmark — exported directly from Figma's Logo component, which is itself a raster screenshot rather than real vector artwork. Treat this as a stand-in until final brand art exists."
      preview={
        <PreviewCard>
          <Logo className="h-16 w-auto" />
        </PreviewCard>
      }
    >
      <DeveloperSection>
        <CodeBlock
          code={`import { Logo } from "@alduin/design-system";

<Logo className="h-10 w-auto" />`}
        />
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          When real logo art is ready, it should replace the image inside
          the Logo component itself — every place that renders{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            &lt;Logo /&gt;
          </code>{" "}
          will update automatically.
        </p>
      </DeveloperSection>
    </DocPage>
  );
}
