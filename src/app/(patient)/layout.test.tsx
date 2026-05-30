import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/shared/test/render";

import PatientLayout from "./layout";

describe("PatientLayout", () => {
  it('wraps children in a data-theme="patient" container', () => {
    const { container } = renderWithProviders(
      <PatientLayout>
        <span>child</span>
      </PatientLayout>,
    );

    const themed = container.querySelector('[data-theme="patient"]');
    expect(themed).not.toBeNull();
    expect(themed).toHaveTextContent("child");
  });

  it("renders its children", () => {
    renderWithProviders(
      <PatientLayout>
        <span>child</span>
      </PatientLayout>,
    );

    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
