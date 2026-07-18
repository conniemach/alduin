import { ProductsMenu } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock } from "@/components/CodeBlock";

export default function ProductsMenuPage() {
  return (
    <DocPage
      kicker="Component"
      title="Products Menu"
      description="A hover-triggered dropdown that lists the product family. Lives inside Navigation, but works on its own anywhere you need a quick jump list."
      preview={
        <PreviewCard>
          <div className="pb-40 pt-4">
            <ProductsMenu />
          </div>
        </PreviewCard>
      }
    >
      <div>
        <h2 className="font-sans text-[15px] font-bold text-neutral-900">
          Try it
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[24px] text-neutral-700">
          Hover &ldquo;Products&rdquo; above to open the list. It also opens
          on click, for touch screens and keyboard users.
        </p>
      </div>

      <DeveloperSection>
        <CodeBlock
          code={`import { ProductsMenu } from "@alduin/design-system";

<ProductsMenu
  products={["Cobalt", "Boreas", "Cypher", "Nightwatch"]}
  onSelect={(product) => ...}
/>`}
        />
        <PropsTable
          rows={[
            {
              name: "products",
              type: "string[]",
              default: "Cobalt, Boreas, Cypher, Nightwatch",
              description: "Items shown in the dropdown.",
            },
            {
              name: "onSelect",
              type: "(product: string) => void",
              description: "Fires when an item is chosen.",
            },
          ]}
        />
      </DeveloperSection>
    </DocPage>
  );
}
