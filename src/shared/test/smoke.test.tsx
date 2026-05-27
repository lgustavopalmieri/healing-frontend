import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

import { renderWithProviders, screen } from "@/shared/test/render";
import { server } from "@/shared/test/msw/server";

describe("test stack", () => {
  it("renders a component through providers", () => {
    renderWithProviders(<p>hello healing</p>);
    expect(screen.getByText("hello healing")).toBeInTheDocument();
  });

  it("intercepts requests with msw and uses faker data", async () => {
    const name = faker.person.fullName();
    server.use(
      http.get("https://api.healing.test/me", () =>
        HttpResponse.json({ name }),
      ),
    );

    const res = await fetch("https://api.healing.test/me");
    const body = (await res.json()) as { name: string };

    expect(body.name).toBe(name);
  });
});
