# Alduin

Three linked projects in one repo:

- `packages/design-system` — the source of truth for every UI component, color, and style.
- `apps/docs` — the design system reference site. Start here if you want to browse what exists, see it in action, and understand when to use it.
- `apps/site` — the real working site/prototype. It imports components directly from the design system, so changes there show up here automatically.

## Getting started

```
pnpm install
pnpm dev
```

This starts:

- the docs site at http://localhost:3001
- the real site at http://localhost:3000
- the design system rebuilding in the background as you edit it — changes appear in both, live, without restarting anything.

To browse the design system as a raw component library instead (every component/variant in isolation, developer-focused):

```
pnpm --filter @alduin/design-system storybook
```

This opens at http://localhost:6006.

## Structure

```
alduin/
├── apps/
│   ├── docs/               Next.js app — the design system reference site
│   └── site/                Next.js app — the real site
└── packages/
    └── design-system/       React components + design tokens (colors, type, motion)
        ├── src/components/    Button, Navigation, ProductFeatures, etc.
        ├── src/tokens/         Colors, typography, spacing, motion as reusable values
        └── src/styles/tokens.css   Same tokens, shared with every app via Tailwind
```
