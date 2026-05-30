import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/shared/test/render";

import ThemesPage from "./page";

// NODE_ENV is "test" here (not "production"), so the notFound() gate is inert.
describe("ThemesPage smoke route", () => {
  it("renders a patient and a specialist panel", () => {
    const { container } = renderWithProviders(<ThemesPage />);

    expect(
      container.querySelector('[data-theme="patient"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-theme="specialist"]'),
    ).not.toBeNull();
  });

  it("shows the key primitives in each panel", () => {
    const { container } = renderWithProviders(<ThemesPage />);

    for (const theme of ["patient", "specialist"]) {
      const panel = container.querySelector<HTMLElement>(
        `[data-theme="${theme}"]`,
      );
      expect(panel).not.toBeNull();
      // button, input and card primitives present in the panel
      expect(panel!.querySelector("button")).not.toBeNull();
      expect(panel!.querySelector("input")).not.toBeNull();
      expect(panel!.querySelector('[data-slot="card"]')).not.toBeNull();
    }

    // badges render their labels
    expect(screen.getAllByText("Default").length).toBe(2);
  });
});
