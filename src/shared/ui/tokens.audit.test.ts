import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Token audit for the design system primitives (KAN-25, criterion 4).
 *
 * Every component in src/shared/ui must style itself with semantic theme
 * tokens only — never literal colors or literal radii — so persona overrides
 * flow through data-theme. This static scan keeps the rule enforced as the
 * design system grows.
 *
 * Allowed: theme utilities (bg-primary, text-muted-foreground, rounded-md),
 * token-derived arbitrary values (rounded-[min(var(--radius-md),10px)],
 * bg-[color-mix(in_oklch,var(--secondary),...)]).
 * Forbidden: hex/rgb/hsl colors, named-palette color classes with a numeric
 * scale (bg-blue-500), and arbitrary radii that are pure literals
 * (rounded-[8px]) rather than token references.
 */

const UI_DIR = join(process.cwd(), "src/shared/ui");

const componentFiles = readdirSync(UI_DIR).filter(
  (file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"),
);

const EXPECTED_PRIMITIVES = ["button.tsx", "input.tsx", "card.tsx", "badge.tsx"];

const HEX_COLOR = /#[0-9a-fA-F]{3,8}\b/;
const FUNCTIONAL_COLOR = /\b(rgb|rgba|hsl|hsla)\(/;
const NAMED_PALETTE_CLASS =
  /\b(bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|caret|accent|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;
// Arbitrary radius classes — capture the bracket body to allow token refs.
const ARBITRARY_RADIUS = /\brounded(?:-[a-z]+)?-\[([^\]]*)\]/g;

describe("src/shared/ui token audit", () => {
  it("has the expected design-system primitives installed", () => {
    for (const primitive of EXPECTED_PRIMITIVES) {
      expect(componentFiles).toContain(primitive);
    }
  });

  it.each(componentFiles)("%s uses no hardcoded colors", (file) => {
    const source = readFileSync(join(UI_DIR, file), "utf8");
    expect(source).not.toMatch(HEX_COLOR);
    expect(source).not.toMatch(FUNCTIONAL_COLOR);
    expect(source).not.toMatch(NAMED_PALETTE_CLASS);
  });

  it.each(componentFiles)("%s uses no literal radii", (file) => {
    const source = readFileSync(join(UI_DIR, file), "utf8");
    const offenders = [...source.matchAll(ARBITRARY_RADIUS)]
      .map((match) => ({ full: match[0], body: match[1] }))
      // Token-derived arbitrary radii are allowed (they reference --radius*).
      .filter(({ body }) => !body.includes("var(--radius"));

    expect(offenders.map((o) => o.full)).toEqual([]);
  });
});
