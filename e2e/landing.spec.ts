import { expect, test } from "@playwright/test";

test.describe("landing (cliente-zero)", () => {
  test("renders the Judson hero and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Judson Lobato" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /acessar painel/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /@judsonlobato/i })).toBeVisible();
  });

  test("/termos and /privacidade load without server errors", async ({ page }) => {
    const termos = await page.goto("/termos");
    expect(termos?.status(), "/termos status").toBeLessThan(500);
    await expect(page).toHaveTitle(/.+/);

    const priv = await page.goto("/privacidade");
    expect(priv?.status(), "/privacidade status").toBeLessThan(500);
    await expect(page).toHaveTitle(/.+/);
  });
});
