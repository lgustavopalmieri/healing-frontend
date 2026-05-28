import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Contract test for the semantic theme tokens (KAN-23).
 *
 * globals.css is plain CSS with no runtime, so we assert its contract by
 * reading the file and inspecting the per-persona [data-theme] blocks:
 *  - both persona blocks exist,
 *  - each declares every required semantic token,
 *  - every semantic color value references a primitive via var() (no literals),
 *  - the violet AI accent is identical across personas,
 *  - the legacy .dark block is gone (dark mode is out of the epic scope).
 */

const css = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

const PERSONAS = ["patient", "specialist"] as const;

/** Color tokens — must always be a var() reference, never a literal value. */
const COLOR_TOKENS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--success",
  "--warning",
  "--danger",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
] as const;

/** Full semantic surface each persona block must declare (color + radius). */
const REQUIRED_TOKENS = [...COLOR_TOKENS, "--radius"] as const;

function themeBlock(persona: string): string {
  const match = css.match(
    new RegExp(`\\[data-theme="${persona}"\\]\\s*\\{([^}]*)\\}`),
  );
  if (!match) {
    throw new Error(`No [data-theme="${persona}"] block found in globals.css`);
  }
  return match[1];
}

function declaredValue(block: string, token: string): string | undefined {
  const match = block.match(new RegExp(`${token}\\s*:\\s*([^;]+);`));
  return match?.[1].trim();
}

describe("semantic theme tokens", () => {
  it.each(PERSONAS)('defines a [data-theme="%s"] block', (persona) => {
    expect(css).toContain(`[data-theme="${persona}"]`);
  });

  it.each(PERSONAS)(
    "%s theme declares every required semantic token",
    (persona) => {
      const block = themeBlock(persona);
      for (const token of REQUIRED_TOKENS) {
        expect(declaredValue(block, token), token).toBeDefined();
      }
    },
  );

  it.each(PERSONAS)(
    "%s theme uses only var() references for color tokens",
    (persona) => {
      const block = themeBlock(persona);
      for (const token of COLOR_TOKENS) {
        const value = declaredValue(block, token);
        expect(value, token).toMatch(/^var\(--[\w-]+\)$/);
      }
    },
  );

  it("uses an identical --accent across patient and specialist", () => {
    const accents = PERSONAS.map((persona) =>
      declaredValue(themeBlock(persona), "--accent"),
    );
    expect(accents[0]).toBe(accents[1]);
  });

  it("does not declare a .dark block", () => {
    expect(css).not.toMatch(/\.dark\s*\{/);
  });
});
