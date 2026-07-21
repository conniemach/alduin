import { BoreasMark, CobaltMark, CypherMark, NightwatchMark } from "@alduin/design-system";
import { DocPage } from "@/components/DocPage";
import { PreviewCard } from "@/components/PreviewCard";
import { DeveloperSection } from "@/components/DeveloperSection";
import { CodeBlock } from "@/components/CodeBlock";

const marks = [
  { name: "Boreas", Mark: BoreasMark },
  { name: "Cobalt", Mark: CobaltMark },
  { name: "Cypher", Mark: CypherMark },
  { name: "Nightwatch", Mark: NightwatchMark },
];

export default function ProductMarksPage() {
  return (
    <DocPage
      kicker="Brand"
      title="Product Marks"
      description="The same idle animation applied consistently across all four products: a real CSS 3D chip that tilts side to side, with matte-plastic shading and each product's glyph engraved into the plate rather than sitting on top of it. One treatment, four glyphs."
      preview={
        <PreviewCard align="stretch">
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {marks.map(({ name, Mark }) => (
              <div key={name} className="flex flex-col items-center gap-3">
                <Mark />
                <span className="font-sans text-[13px] text-neutral-500">{name}</span>
              </div>
            ))}
          </div>
        </PreviewCard>
      }
    >
      <DeveloperSection>
        <CodeBlock
          code={`import { CobaltMark, BoreasMark, CypherMark, NightwatchMark } from "@alduin/design-system";
// once per app, alongside the other design-system CSS imports:
// @import "@alduin/design-system/product-mark.css";

<CobaltMark />`}
        />
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          Each is a fixed-size (280×280) component — the plate&rsquo;s
          radius, edge thickness, and every effect layer are tuned in
          pixels for that one size, so scale the whole thing with a CSS{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            transform
          </code>{" "}
          rather than resizing it directly. The tilt loop pauses on a
          static angle for anyone with{" "}
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            prefers-reduced-motion
          </code>{" "}
          set.
        </p>
        <p className="font-sans text-[14px] leading-[22px] text-neutral-700">
          All four share one treatment (
          <code className="rounded bg-neutral-900/5 px-1 py-0.5 font-mono text-[13px]">
            ProductMark
          </code>
          , internal) and one glow color rather than each product&rsquo;s
          own exact source green &mdash; that color is local to this
          component rather than a system color token, since the shared
          palette stays intentionally monochrome (see{" "}
          <a href="/foundations/colors" className="underline">
            Colors
          </a>
          ).
        </p>
      </DeveloperSection>
    </DocPage>
  );
}
