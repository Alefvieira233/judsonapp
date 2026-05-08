import { expect, test } from "@playwright/test";

test.describe("invite flow (unknown token)", () => {
  test("renders a not-found page for an unknown invite token", async ({
    page,
  }) => {
    // The page calls notFound() when the invite doesn't exist, so we expect
    // 404 status and no crash. We don't have a way to mint a real invite
    // here without DB seeding — see TESTING.md for the seeded variant.
    const res = await page.goto("/invite/totally-fake-token-xyz");
    expect(res?.status()).toBe(404);
  });
});
