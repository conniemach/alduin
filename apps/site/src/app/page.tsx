import { Button, Card, CardTitle, CardDescription } from "@alduin/design-system";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-10">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Alduin</h1>
        <p className="mt-2 text-neutral-500">
          This page is built from components that live in the design system.
          Change a component there and this page updates automatically.
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardTitle>Design system component</CardTitle>
        <CardDescription>
          This card and the button below both come from
          @alduin/design-system.
        </CardDescription>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
        </div>
      </Card>
    </main>
  );
}
