import { expect, test } from "@playwright/test";

const enabled = process.env.MULTI_TENANT_ENABLED === "true";

test.describe("multi-tenant landing", () => {
  test.skip(
    !enabled,
    "Set MULTI_TENANT_ENABLED=true to exercise the SaaS landing.",
  );

  test("renders the SaaS hero and signup form", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /teu app, tua marca/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /criar minha conta/i }),
    ).toBeVisible();
  });

  test("/criar-conta-personal renders the form", async ({ page }) => {
    await page.goto("/criar-conta-personal");
    await expect(
      page.getByRole("heading", {
        name: /crie teu app de personal trainer em 60 segundos/i,
      }),
    ).toBeVisible();
    // The form should be present somewhere on the page.
    await expect(page.locator("form")).toBeVisible();
  });
});
