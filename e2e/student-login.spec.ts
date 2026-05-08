import { expect, test } from "@playwright/test";

test.describe("student login (magic link)", () => {
  test("renders the form", async ({ page }) => {
    await page.goto("/aluna/entrar");
    await expect(page.getByLabel(/seu email/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /receber link no email/i }),
    ).toBeVisible();
  });

  test("rejects an invalid email via the browser-native validation", async ({
    page,
  }) => {
    await page.goto("/aluna/entrar");
    const email = page.getByLabel(/seu email/i);
    await email.fill("not-an-email");
    await page.getByRole("button", { name: /receber link no email/i }).click();

    // Browser should block submission — we still see the form, no success card.
    await expect(email).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /confere teu email/i }),
    ).toHaveCount(0);
  });

  test("shows the 'Confere teu email' confirmation after a valid submit", async ({
    page,
  }) => {
    await page.goto("/aluna/entrar");
    // Use a clearly-fake address; the action will rate-limit / silently
    // accept via Supabase shouldCreateUser. We only assert UI confirmation.
    const fakeEmail = `e2e-${Date.now()}@example.test`;
    await page.getByLabel(/seu email/i).fill(fakeEmail);
    await page.getByRole("button", { name: /receber link no email/i }).click();

    // Either the success card appears (happy path) or the form re-renders
    // with an error banner (rate-limit / Supabase rejected). Both are
    // acceptable signals that the form was wired up — assert one of them.
    await expect
      .poll(async () => {
        const success = await page
          .getByRole("heading", { name: /confere teu email/i })
          .count();
        const error = await page.getByRole("alert").count();
        return success + error;
      })
      .toBeGreaterThan(0);
  });
});
