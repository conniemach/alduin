import { Button, ButtonLinkout } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

export default function ButtonsPage() {
  return (
    <DocPage
      kicker="Component"
      title="Buttons"
      description="Two buttons, two jobs. Button is the everyday action — white, high-contrast, used for the primary thing on a page. ButtonLinkout is specifically for links that take someone somewhere else (external sites, other products) — it always carries an arrow."
      preview={
        <PreviewCard>
          <div className="flex flex-wrap items-center gap-4">
            <Button>Learn More</Button>
            <ButtonLinkout>Learn More</ButtonLinkout>
          </div>
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          Try it
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          Hover either button above — Button shifts to a dark fill with a
          deliberately slow, cinematic transition (about a second).
          ButtonLinkout keeps its black fill and gains a thin white outline
          instead.
        </p>
      </div>

      <DeveloperSection>
        <CodeBlock
          code={`import { Button, ButtonLinkout } from "@alduin/design-system";

<Button onClick={...}>Learn More</Button>
<ButtonLinkout onClick={...}>Learn More</ButtonLinkout>`}
        />
        <PropsTable
          rows={[
            {
              name: "children",
              type: "ReactNode",
              description: "Button label.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Dims the button and blocks interaction.",
            },
            {
              name: "...props",
              type: "ButtonHTMLAttributes",
              description:
                "Any native button attribute — onClick, type, aria-label, etc.",
            },
          ]}
        />
      </DeveloperSection>
    </DocPage>
  );
}
