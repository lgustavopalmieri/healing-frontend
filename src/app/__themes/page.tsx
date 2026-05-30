import { notFound } from "next/navigation";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

/**
 * TEMPORARY smoke route (KAN-25).
 *
 * Renders the patient and specialist themes side by side so the persona
 * tokens can be eyeballed during the design-system epic. It lives outside the
 * route groups, so each panel declares its own data-theme inline.
 *
 * Remove this route at the end of the epic (KAN-6 / KAN-5). It is gated to
 * non-production environments via notFound() below.
 */

const PERSONAS = [
  { theme: "patient", label: "Patient" },
  { theme: "specialist", label: "Specialist" },
] as const;

function ThemePanel({ theme, label }: { theme: string; label: string }) {
  return (
    <section
      data-theme={theme}
      className="flex flex-1 flex-col gap-4 bg-background p-6 text-foreground"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>
        <code className="text-sm text-muted-foreground">
          data-theme=&quot;{theme}&quot;
        </code>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>

      <Input placeholder="Input field" />

      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>
            Tokens resolve from the panel&apos;s data-theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Card body content rendered with semantic tokens.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export default function ThemesPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="flex min-h-svh flex-col md:flex-row">
      {PERSONAS.map((persona) => (
        <ThemePanel
          key={persona.theme}
          theme={persona.theme}
          label={persona.label}
        />
      ))}
    </main>
  );
}
