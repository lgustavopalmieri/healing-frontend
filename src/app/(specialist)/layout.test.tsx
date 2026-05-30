import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/shared/test/render";

import SpecialistLayout from "./layout";

describe("SpecialistLayout", () => {
  it('wraps children in a data-theme="specialist" container', () => {
    const { container } = renderWithProviders(
      <SpecialistLayout>
        <span>child</span>
      </SpecialistLayout>,
    );

    const themed = container.querySelector('[data-theme="specialist"]');
    expect(themed).not.toBeNull();
    expect(themed).toHaveTextContent("child");
  });

  it("renders its children", () => {
    renderWithProviders(
      <SpecialistLayout>
        <span>child</span>
      </SpecialistLayout>,
    );

    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
