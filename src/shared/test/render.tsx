import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

function AllProviders({ children }: { children: ReactNode }) {
  return <NuqsTestingAdapter>{children}</NuqsTestingAdapter>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
