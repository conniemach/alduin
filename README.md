# Alduin

Two linked projects in one repo:

- `packages/design-system` — the source of truth for every UI component, color, and style. Browse it interactively with Storybook.
- `apps/site` — the real working site/prototype. It imports components directly from the design system, so changes there show up here automatically.

## Getting started

```
pnpm install
pnpm dev
```

This starts the site at http://localhost:3000 and keeps the design system rebuilding in the background as you edit it — changes appear on the site without restarting anything.

To browse the design system on its own (every component, every variant, in isolation):

```
pnpm --filter @alduin/design-system storybook
```

This opens at http://localhost:6006.

## Structure

```
alduin/
├── apps/
│   └── site/              Next.js app — the real site
└── packages/
    └── design-system/     React components + design tokens (colors, spacing, fonts)
        ├── src/components/  Button, Card, etc.
        ├── src/tokens/       Colors, spacing, fonts as reusable values
        └── src/styles/tokens.css   Same tokens, shared with the site via Tailwind
```
