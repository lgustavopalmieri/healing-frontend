import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Contract test for the root layout font wiring (KAN-25).
 *
 * layout.tsx configures the application fonts via next/font; we assert its
 * contract by reading the file statically:
 *  - the sans font is Inter, imported from next/font/google,
 *  - the legacy Geist sans import is gone,
 *  - Geist_Mono is still imported (mono font is kept by scope decision),
 *  - Inter is bound to a CSS variable consumed by the @theme inline block.
 */

const layout = readFileSync(
  join(process.cwd(), "src/app/layout.tsx"),
  "utf8",
);

describe("root layout font wiring", () => {
  it("imports Inter from next/font/google", () => {
    expect(layout).toMatch(/import\s*\{[^}]*\bInter\b[^}]*\}\s*from\s*"next\/font\/google"/);
  });

  it("no longer imports the Geist sans font", () => {
    // Geist_Mono is allowed; bare "Geist" (the sans) must be gone.
    expect(layout).not.toMatch(/\bGeist\b(?!_Mono)/);
  });

  it("still imports Geist_Mono", () => {
    expect(layout).toMatch(/\bGeist_Mono\b/);
  });

  it("binds Inter to the --font-inter variable", () => {
    expect(layout).toMatch(/Inter\(\{[^}]*variable:\s*"--font-inter"/);
  });
});
