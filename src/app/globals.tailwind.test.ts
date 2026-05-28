import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Contract test for the @theme inline bridge (KAN-24).
 *
 * Verifies that globals.css maps every semantic color token to a Tailwind
 * --color-* entry, radius variants to --radius-*, and font tokens — all via
 * var() references, so utilities like bg-background and rounded-lg resolve
 * dynamically from the active data-theme without literal values.
 */

const css = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

/** Same list as globals.theme.test.ts — kept in sync manually until extracted. */
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

const RADIUS_VARIANTS = ["sm", "md", "lg", "xl"] as const;

function themeInlineBlock(): string {
  const match = css.match(/@theme inline\s*\{([^}]*)\}/);
  if (!match) {
    throw new Error("No @theme inline block found in globals.css");
  }
  return match[1];
}

function declaredValue(block: string, property: string): string | undefined {
  const match = block.match(new RegExp(`${property}\\s*:\\s*([^;]+);`));
  return match?.[1].trim();
}

describe("tailwind @theme bridge", () => {
  it("declares a @theme inline block", () => {
    expect(css).toContain("@theme inline {");
  });

  it.each(COLOR_TOKENS)(
    "maps %s to a --color-* theme entry",
    (token) => {
      const block = themeInlineBlock();
      const colorProp = token.replace("--", "--color-");
      expect(
        declaredValue(block, colorProp),
        `${colorProp} missing from @theme inline`,
      ).toBeDefined();
    },
  );

  it.each(COLOR_TOKENS)(
    "binds --color-* entry for %s to var() without literals",
    (token) => {
      const block = themeInlineBlock();
      const colorProp = token.replace("--", "--color-");
      const value = declaredValue(block, colorProp);
      expect(value, colorProp).toBe(`var(${token})`);
    },
  );

  it.each(RADIUS_VARIANTS)(
    "declares --radius-%s using var(--radius)",
    (variant) => {
      const block = themeInlineBlock();
      const value = declaredValue(block, `--radius-${variant}`);
      expect(value, `--radius-${variant}`).toMatch(/var\(--radius\)/);
    },
  );

  it("declares --font-sans and --font-mono", () => {
    const block = themeInlineBlock();
    expect(declaredValue(block, "--font-sans"), "--font-sans").toBeDefined();
    expect(declaredValue(block, "--font-mono"), "--font-mono").toBeDefined();
  });
});
