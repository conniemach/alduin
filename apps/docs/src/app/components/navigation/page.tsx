import { Navigation, NavigationMobile, ProductsMenu } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

export default function NavigationPage() {
  return (
    <DocPage
      kicker="Component"
      title="Navigation"
      description="The page header. Desktop is a simple bar — logo on the left, links and a linkout button on the right. Below a certain width, it collapses into NavigationMobile: a compact bar that expands into a full-height menu."
      preview={
        <PreviewCard align="stretch">
          <div className="w-full">
            <Navigation>
              <ProductsMenu />
            </Navigation>
          </div>
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          Mobile
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          Tap the menu icon below to open it — the panel slides down and the
          icon swaps to a close (×).
        </p>
      </div>

      <PreviewCard align="start">
        <div className="mx-auto w-[375px] overflow-hidden rounded-lg">
          <NavigationMobile />
        </div>
      </PreviewCard>

      <DeveloperSection>
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          The Figma component only defines a logo slot and one linkout
          button — no nav links are hardcoded. Pass links as children (e.g.
          a <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">ProductsMenu</code>) when assembling a real page header.
        </p>
        <CodeBlock
          code={`import { Navigation, NavigationMobile, ProductsMenu } from "@alduin/design-system";

<Navigation onLinkoutClick={...}>
  <ProductsMenu onSelect={(product) => ...} />
</Navigation>

// below your breakpoint of choice:
<NavigationMobile
  links={["Benefits", "Specifications", "How-to", "Contact Us"]}
  onLinkClick={(link) => ...}
  onLinkoutClick={...}
/>`}
        />
        <PropsTable
          rows={[
            {
              name: "logo",
              type: "ReactNode",
              default: '"Area"',
              description: "Content in the logo slot (placeholder text by default).",
            },
            {
              name: "linkoutLabel",
              type: "string",
              default: '"Learn More"',
              description: "Label for the CTA button.",
            },
            {
              name: "onLinkoutClick",
              type: "() => void",
              description: "Fires when the CTA is clicked.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Nav links, placed before the CTA (Navigation only).",
            },
            {
              name: "links",
              type: "string[]",
              default: "Benefits, Specifications, How-to, Contact Us",
              description: "Menu items (NavigationMobile only).",
            },
            {
              name: "onLinkClick",
              type: "(link: string) => void",
              description: "Fires when a menu item is tapped (NavigationMobile only).",
            },
          ]}
        />
      </DeveloperSection>
    </DocPage>
  );
}
